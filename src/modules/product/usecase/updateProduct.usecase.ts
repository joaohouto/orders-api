import { prisma } from "@/prisma/client";
import { UpdateProductInput } from "../schema/updateProduct.shema";
import { checkPermission } from "@/core/permission/checkPermission";
import { Decimal } from "@prisma/client/runtime/library";

interface Params {
  storeSlug: string;
  productSlug: string;
  requesterId: string;
  data: UpdateProductInput;
}

export async function updateProduct({
  storeSlug,
  productSlug,
  requesterId,
  data,
}: Params) {
  const store = await prisma.store.findUnique({
    where: {
      slug: storeSlug,
    },
  });

  if (!store) throw new Error("Loja não encontrada");

  const hasPermission = await checkPermission({
    storeId: store.id,
    userId: requesterId,
    allowedRoles: ["OWNER", "EDIT"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  const product = await prisma.product.findFirst({
    where: { storeId: store.id, slug: productSlug, deletedAt: null },
  });

  if (!product) throw new Error("Produto não encontrado");

  const slugTaken = await prisma.product.findFirst({
    where: { storeId: store.id, slug: data.slug, deletedAt: null, NOT: { id: product.id } },
  });

  if (slugTaken) throw new Error("Slug já em uso");

  const updated = await prisma.$transaction(async (tx) => {
    const existingGroups = await tx.variationGroup.findMany({
      where: { productId: product.id },
      select: { id: true },
    });
    const groupIds = existingGroups.map((g) => g.id);

    await tx.variation.deleteMany({ where: { groupId: { in: groupIds } } });
    await tx.variationGroup.deleteMany({ where: { productId: product.id } });

    return tx.product.update({
      where: { id: product.id },
      data: {
        name: data.name,
        slug: data.slug,
        price: new Decimal(data.price),
        images: data.images,
        isActive: data.isActive,
        soldOutAt: data.soldOutAt ?? null,
        description: data.description,
        acceptOrderNote: data.acceptOrderNote,
        variationGroups: {
          create: data.variationGroups.map((g) => ({
            name: g.name,
            variations: {
              create: g.variations.map((v) => ({
                name: v.name,
                priceAdjustment: new Decimal(v.priceAdjustment),
              })),
            },
          })),
        },
      },
      include: {
        variationGroups: { include: { variations: true } },
      },
    });
  });

  return updated;
}
