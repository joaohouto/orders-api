import { prisma } from "@/prisma/client";

interface RemoveCollaboratorDTO {
  storeId: string;
  userIdToRemove: string;
  requesterId: string;
}

export async function removeCollaborator({
  storeId,
  userIdToRemove,
  requesterId,
}: RemoveCollaboratorDTO) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
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
      storeId,
      userId: userIdToRemove,
    },
  });

  if (!found) {
    throw new Error("O usuário informado não é colaborador");
  }

  await prisma.collaborator.delete({
    where: {
      storeId_userId: {
        storeId,
        userId: userIdToRemove,
      },
    },
  });

  return { msg: "Colaborador removido com sucesso" };
}
