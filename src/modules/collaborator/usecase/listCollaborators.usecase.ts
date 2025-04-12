import { prisma } from "@/prisma/client";

interface ListCollaboratorsDTO {
  storeSlug: string;
  requesterId: string;
}

export async function listCollaborators({
  storeSlug,
  requesterId,
}: ListCollaboratorsDTO) {
  // Verifica se o requester tem acesso à loja
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    include: {
      owner: true,
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

  const list = store.collaborators.map((c) => ({
    id: c.id,
    userId: c.userId,
    name: c.user.name,
    email: c.user.email,
    role: c.role,
    avatar: c.avatar,
  }));

  list.unshift({
    id: "owner",
    userId: store.owner.id,
    name: store.owner.name,
    email: store.owner.email,
    avatar: store.owner.avatar,
    role: "OWNER",
  });

  return list;
}
