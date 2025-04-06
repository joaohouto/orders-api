import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";

import type { OrderStatus } from "@/shared/enums/orderStatus";

export async function updateOrderStatusUseCase(
  orderId: string,
  userId: string,
  newStatus: OrderStatus
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  // Verifica se user é dono ou colaborador
  const hasPermission = await checkPermission({
    storeId: order.storeId,
    userId,
    allowedRoles: ["OWNER", "EDIT"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  // grava histórico de status
  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      status: newStatus,
      changedById: userId,
    },
  });

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
    },
  });

  return updatedOrder;
}
