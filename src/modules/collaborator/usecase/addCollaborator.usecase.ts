import { prisma } from "@/prisma/client";

interface AddCollaboratorDTO {
  storeSlug: string;
  userEmailToAdd: string;
  role: "VIEW" | "EDIT";
  requesterId: string;
}

export async function addCollaborator({
  storeSlug,
  userEmailToAdd,
  role,
  requesterId,
}: AddCollaboratorDTO) {
  // 1. Busca o usuário pelo e-mail
  const userToAdd = await prisma.user.findUnique({
    where: { email: userEmailToAdd },
  });

  if (!userToAdd) {
    throw new Error("Usuário com esse e-mail não foi encontrado.");
  }

  // 1. Verifica se requester é dono da loja
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
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
        userId: userToAdd.id,
      },
    },
  });

  if (exists) {
    throw new Error("Usuário já é colaborador dessa loja.");
  }

  // 3. Impede a auto adição como colaborador
  if (store.ownerId === userToAdd.id) {
    throw new Error("Usuário já é o dono da loja.");
  }

  // 4.  Cria colaborador
  const collaborator = await prisma.collaborator.create({
    data: {
      storeId,
      userId: userToAdd.id,
      role,
    },
  });

  return collaborator;
}
