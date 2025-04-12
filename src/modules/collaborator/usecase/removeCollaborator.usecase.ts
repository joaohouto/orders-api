import { prisma } from "@/prisma/client";

interface RemoveCollaboratorDTO {
  storeSlug: string;
  userIdToRemove: string;
  requesterId: string;
}

export async function removeCollaborator({
  storeSlug,
  userIdToRemove,
  requesterId,
}: RemoveCollaboratorDTO) {
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) throw new Error("Loja não encontrada");

  if (store.ownerId !== requesterId)
    throw new Error("Apenas o dono pode remover colaboradores");

  // Garante que não tá tentando remover ele mesmo como owner
  if (userIdToRemove === requesterId) {
    throw new Error("O dono não pode se remover");
  }

  const found = await prisma.collaborator.findFirst({
    where: {
      storeId: store.id,
      userId: userIdToRemove,
    },
  });

  if (!found) {
    throw new Error("O usuário informado não é colaborador");
  }

  await prisma.collaborator.delete({
    where: {
      storeId_userId: {
        storeId: store.id,
        userId: userIdToRemove,
      },
    },
  });

  return { msg: "Colaborador removido com sucesso" };
}
