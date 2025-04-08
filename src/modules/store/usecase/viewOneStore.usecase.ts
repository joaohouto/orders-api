import { prisma } from "@/prisma/client";

interface viewOneStoreDTO {
  storeSlug: string;
}

export async function viewOneStore({ storeSlug }: viewOneStoreDTO) {
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  return store;
}
