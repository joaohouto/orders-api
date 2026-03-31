import { sendOrderEmail } from "@/lib/resend";
import { prisma } from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { CreateOrderInput } from "../schema/createOrder.schema";

export async function createOrder(
  data: CreateOrderInput,
  storeId: string,
  userId: string
) {
  const { items } = data;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) throw new Error("Loja não encontrada");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("Usuário não encontrado");

  let totalPrice = new Decimal(0);
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: { id: item.productId, storeId, deletedAt: null },
    });

    if (!product) throw new Error("Produto inválido");

    const variations = await prisma.variation.findMany({
      where: {
        id: { in: item.variationIds },
        productId: item.productId,
        deletedAt: null,
      },
    });

    if (variations.length !== item.variationIds.length) {
      throw new Error("Uma ou mais variações inválidas");
    }

    const adjustment = variations.reduce(
      (sum, v) => sum.add(v.priceAdjustment),
      new Decimal(0)
    );
    const unitPrice = product.price.add(adjustment);

    totalPrice = totalPrice.add(unitPrice.mul(item.quantity));

    orderItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice,
      quantity: item.quantity,
      note: item.note,
      selectedVariations: variations.map((v) => ({
        variationId: v.id,
        variationName: v.name,
        variationType: v.type,
      })),
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      storeId,
      totalPrice,
      buyerName: user.name,
      buyerPhone: user.phone,
      items: {
        create: orderItems.map(({ selectedVariations, ...item }) => ({
          ...item,
          selectedVariations: {
            create: selectedVariations,
          },
        })),
      },
    },
    include: {
      items: { include: { selectedVariations: true } },
      user: true,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      status: "PENDING",
      changedById: userId,
    },
  });

  await sendOrderEmail({
    orderId: order.id,
    orderCode: order.code,
    items: orderItems,
    name: order.user.name,
    to: order.user.email,
    total: order.totalPrice,
  });

  return order;
}
