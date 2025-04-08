import { prisma } from "@/prisma/client";

export async function getProductBySlug(storeSlug: string, productSlug: string) {
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) throw new Error("Loja não encontrada");

  const product = await prisma.product.findFirst({
    where: { storeId: store.id, slug: productSlug, deletedAt: null },
    include: {
      variations: true,
      store: {
        select: {
          name: true,
          icon: true,
        },
      },
    },
  });

  if (!product) throw new Error("Produto não encontrado");

  return product;
}
