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
    const variation = await prisma.variation.findFirst({
      where: {
        id: item.variationId,
        productId: item.productId,
        deletedAt: null,
        product: {
          deletedAt: null,
          storeId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!variation) throw new Error("Produto ou variação inválida");

    const unitPrice = variation.price;
    const itemTotal = unitPrice.mul(item.quantity);
    totalPrice = totalPrice.add(itemTotal);

    orderItems.push({
      productId: variation.productId,
      variationId: variation.id,
      productName: variation.product.name,
      variationName: variation.name,
      unitPrice,
      quantity: item.quantity,
      note: item.note,
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
        createMany: {
          data: orderItems,
        },
      },
    },
    include: {
      items: true,
      user: true,
    },
  });

  // grava histórico de status
  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      status: "PENDING",
      changedById: userId,
    },
  });

  // enviar email com os dados do pedido
  await sendOrderEmail({
    orderId: order.id,
    items: orderItems,
    name: order.user.name,
    to: order.user.email,
    total: order.totalPrice,
  });

  return order;
}
