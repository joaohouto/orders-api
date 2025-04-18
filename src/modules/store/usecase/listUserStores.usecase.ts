import { prisma } from "@/prisma/client";

interface ListUserStoresDTO {
  requesterId: string;
}

export async function listUserStores({ requesterId }: ListUserStoresDTO) {
  const myStores = await prisma.store.findMany({
    where: { ownerId: requesterId },
  });

  const collaborations = await prisma.collaborator.findMany({
    where: {
      userId: requesterId,
    },
    include: {
      store: true,
    },
  });

  const collaborationStores = collaborations.map((c) => {
    return {
      ...c.store,
      role: c.role,
    };
  });

  const stores = myStores.map((s) => {
    return {
      ...s,
      role: "OWNER",
    };
  });

  return stores.concat(collaborationStores);
}
