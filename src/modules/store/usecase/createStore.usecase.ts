import { prisma } from "@/prisma/client";

interface CreateStoreDTO {
  name: string;
  slug: string;
  ownerId: string;
  instagram?: string;
}

export const createStore = async ({
  name,
  slug,
  instagram,
  ownerId,
}: CreateStoreDTO) => {
  const store = await prisma.store.create({
    data: {
      name,
      slug,
      instagram,
      ownerId,
    },
  });

  return store;
};
