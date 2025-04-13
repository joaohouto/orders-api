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

  const existing = await prisma.product.findFirst({
    where: { storeId: store.id, slug: data.slug, NOT: { slug: productSlug } },
  });

  if (existing) throw new Error("Slug já em uso");

  const updated = await prisma.product.update({
    where: { slug: productSlug },
    data: {
      name: data.name,
      slug: data.slug,
      images: data.images,
      isActive: data.isActive,
      description: data.description,
      variations: {
        deleteMany: {},
        create: data.variations.map((v) => ({
          name: v.name,
          price: new Decimal(v.price),
        })),
      },
    },
    include: {
      variations: true,
    },
  });

  return updated;
}
