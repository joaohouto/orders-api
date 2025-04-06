import { prisma } from "@/prisma/client";

export async function getProductBySlug(storeId: string, slug: string) {
  const product = await prisma.product.findFirst({
    where: { storeId, slug, deletedAt: null },
    include: {
      variations: true,
    },
  });

  if (!product) throw new Error("Produto não encontrado");

  return product;
}
