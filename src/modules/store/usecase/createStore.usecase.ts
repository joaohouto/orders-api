import { prisma } from "@/prisma/client";

interface CreateStoreDTO {
  name: string;
  slug: string;
  ownerId: string;
}

export const createStore = async ({ name, slug, ownerId }: CreateStoreDTO) => {
  const store = await prisma.store.create({
    data: {
      name,
      slug,
      ownerId,
    },
  });

  return store;
};
