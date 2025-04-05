import { prisma } from "@/prisma/client";

interface AddCollaboratorDTO {
  storeId: string;
  userIdToAdd: string;
  role: "VIEW" | "EDIT";
  requesterId: string;
}

export async function addCollaborator({
  storeId,
  userIdToAdd,
  role,
  requesterId,
}: AddCollaboratorDTO) {
  // 1. Verifica se requester é dono da loja
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store || store.ownerId !== requesterId) {
    throw new Error(
      "Acesso negado. Apenas o dono pode adicionar colaboradores."
    );
  }

  // 2. Verifica se usuário já é colaborador
  const exists = await prisma.collaborator.findUnique({
    where: {
      storeId_userId: {
        storeId,
        userId: userIdToAdd,
      },
    },
  });

  if (exists) {
    throw new Error("Usuário já é colaborador dessa loja.");
  }

  // 3. Impede a auto adição como colaborador
  if (store.ownerId === userIdToAdd) {
    throw new Error("Usuário já é o dono da loja.");
  }

  // 4.  Cria colaborador
  const collaborator = await prisma.collaborator.create({
    data: {
      storeId,
      userId: userIdToAdd,
      role,
    },
  });

  return collaborator;
}
