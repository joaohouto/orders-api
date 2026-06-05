import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { ForbiddenError } from "@/shared/errors";

export async function reorderProducts({
  storeSlug,
  productIds,
  requesterId,
}: {
  storeSlug: string;
  productIds: string[];
  requesterId: string;
}) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) throw new Error("Loja não encontrada");

  const allowed = await checkPermission({
    storeId: store.id,
    userId: requesterId,
    allowedRoles: ["OWNER", "EDIT"],
  });
  if (!allowed) throw new ForbiddenError("Sem permissão para reordenar produtos");

  await prisma.$transaction(
    productIds.map((id, index) =>
      prisma.product.update({ where: { id }, data: { position: index } }),
    ),
  );
}
