import { prisma } from "@/prisma/client";

import type { CollaboratorRole } from "@/shared/enums/collaboratorRole";

interface UpdateCollaboratorRoleDTO {
  storeId: string;
  userIdToUpdate: string;
  newRole: CollaboratorRole;
  requesterId: string;
}

export async function updateCollaboratorRole({
  storeId,
  userIdToUpdate,
  newRole,
  requesterId,
}: UpdateCollaboratorRoleDTO) {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) throw new Error("Loja não encontrada");
  if (store.ownerId !== requesterId)
    throw new Error("Apenas o dono pode alterar permissões");

  if (userIdToUpdate === requesterId) {
    throw new Error("O dono não pode alterar a própria permissão");
  }

  const collaborator = await prisma.collaborator.findUnique({
    where: {
      storeId_userId: {
        storeId,
        userId: userIdToUpdate,
      },
    },
  });

  if (!collaborator) throw new Error("Colaborador não encontrado");

  const updated = await prisma.collaborator.update({
    where: {
      storeId_userId: {
        storeId,
        userId: userIdToUpdate,
      },
    },
    data: {
      role: newRole,
    },
  });

  return {
    msg: "Permissão atualizada com sucesso",
    role: updated.role,
  };
}
