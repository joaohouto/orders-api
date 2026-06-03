import { prisma } from "@/prisma/client";

export async function reorderProducts({
  storeSlug,
  productIds,
}: {
  storeSlug: string;
  productIds: string[];
}) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) throw new Error("Loja não encontrada");

  await prisma.$transaction(
    productIds.map((id, index) =>
      prisma.product.update({ where: { id }, data: { position: index } }),
    ),
  );
}
