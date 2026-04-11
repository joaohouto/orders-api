import { generateUniqueOrderCode } from "@/lib/orderCode";
import { sendOrderEmail } from "@/lib/resend";
import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { Decimal } from "@prisma/client/runtime/library";
import { CreateGuestOrderInput } from "../schema/createGuestOrder.schema";

export async function createGuestOrder(
  data: CreateGuestOrderInput,
  storeSlug: string,
  requesterId: string
) {
  const { items, buyerName, buyerPhone, buyerEmail } = data;

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) throw new Error("Loja não encontrada");

  const hasPermission = await checkPermission({
    storeId: store.id,
    userId: requesterId,
    allowedRoles: ["OWNER", "EDIT"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  let totalPrice = new Decimal(0);
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: { id: item.productId, storeId: store.id, deletedAt: null },
    });

    if (!product) throw new Error("Produto inválido");

    const variations = await prisma.variation.findMany({
      where: {
        id: { in: item.variationIds },
        group: { productId: item.productId },
        deletedAt: null,
      },
      include: { group: true },
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
        variationGroup: v.group.name,
      })),
    });
  }

  const code = await generateUniqueOrderCode();

  const order = await prisma.order.create({
    data: {
      code,
      storeId: store.id,
      totalPrice,
      buyerName,
      buyerPhone,
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
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      status: "PENDING",
      changedById: requesterId,
    },
  });

  if (buyerEmail) {
    await sendOrderEmail({
      orderId: order.id,
      orderCode: order.code,
      items: orderItems,
      name: buyerName,
      to: buyerEmail,
      total: order.totalPrice,
    });
  }

  return order;
}
