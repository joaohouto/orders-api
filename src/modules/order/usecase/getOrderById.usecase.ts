import { prisma } from "@/prisma/client";

export async function getOrderByIdUseCase(
  orderId: string,
  requesterId: string
) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      user: true,
      store: {
        include: {
          owner: true,
          collaborators: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      statusHistory: {
        include: {
          changedBy: true,
        },
      },
      payments: true,
    },
  });

  if (!order) throw new Error("Pedido não encontrado");

  const isOrderOwner = order.user.id === requesterId;
  const isStoreOwner = order.store.owner.id === requesterId;
  const isCollaborator = order.store.collaborators.some(
    (collab) =>
      collab.userId === requesterId &&
      (collab.role === "EDIT" || collab.role === "VIEW")
  );

  if (!isOrderOwner && !isStoreOwner && !isCollaborator) {
    throw new Error("Acesso negado");
  }

  return order;
}
