import { prisma } from "@/prisma/client";

interface ListCollaboratorsDTO {
  storeId: string;
  requesterId: string;
}

export async function listCollaborators({
  storeId,
  requesterId,
}: ListCollaboratorsDTO) {
  // Verifica se o requester tem acesso à loja
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      collaborators: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!store) throw new Error("Loja não encontrada");

  const isOwner = store.ownerId === requesterId;
  const isCollaborator = store.collaborators.some(
    (c) => c.userId === requesterId
  );

  if (!isOwner && !isCollaborator) {
    throw new Error("Acesso negado");
  }

  return store.collaborators.map((c) => ({
    id: c.id,
    userId: c.userId,
    name: c.user.name,
    email: c.user.email,
    role: c.role,
  }));
}
