import { prisma } from "@/prisma/client";

export async function cancelOrderUseCase(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.userId !== userId) {
    throw new Error("Você não tem permissão para cancelar este pedido");
  }

  if (["DELIVERED", "CANCELED"].includes(order.status)) {
    throw new Error("Este pedido não pode mais ser cancelado");
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELED",
    },
  });

  // Histórico
  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      status: "CANCELED",
      changedById: userId,
    },
  });

  return updatedOrder;
}
