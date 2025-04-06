import { prisma } from "@/prisma/client";

interface ListUserStoresDTO {
  requesterId: string;
}

export async function listUserStores({ requesterId }: ListUserStoresDTO) {
  const stores = await prisma.store.findMany({
    where: { ownerId: requesterId },
  });

  return stores;
}
