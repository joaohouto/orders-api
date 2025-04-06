import { prisma } from "@/prisma/client";
import { UpdateProductInput } from "../schema/updateProduct.shema";
import { checkPermission } from "@/core/permission/checkPermission";
import { Decimal } from "@prisma/client/runtime/library";

interface Params {
  storeId: string;
  productId: string;
  requesterId: string;
  data: UpdateProductInput;
}

export async function updateProduct({
  storeId,
  productId,
  requesterId,
  data,
}: Params) {
  const hasPermission = await checkPermission({
    storeId,
    userId: requesterId,
    allowedRoles: ["OWNER", "EDIT"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  const existing = await prisma.product.findFirst({
    where: { storeId, slug: data.slug, NOT: { id: productId } },
  });

  if (existing) throw new Error("Slug já em uso");

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      slug: data.slug,
      images: data.images,
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
