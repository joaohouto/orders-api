import { prisma } from "@/prisma/client";

export async function listAllStores() {
  const stores = await prisma.store.findMany({
    where: {},
  });

  return stores;
}
