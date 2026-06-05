import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { ForbiddenError } from "@/shared/errors";

export async function cancelOrderUseCase(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  const isOrderOwner = order.userId === userId;
  const isStoreAdmin = await checkPermission({
    storeId: order.storeId,
    userId,
    allowedRoles: ["OWNER", "EDIT"],
  });

  if (!isOrderOwner && !isStoreAdmin) {
    throw new ForbiddenError("Você não tem permissão para cancelar este pedido");
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
