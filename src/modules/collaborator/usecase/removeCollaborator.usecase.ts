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

  console.log(userIdToRemove);

  await prisma.collaborator.deleteMany({
    where: {
      storeId,
      userId: userIdToRemove,
    },
  });

  return { msg: "Colaborador removido com sucesso" };
}
