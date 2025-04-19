import { UpdateStoreInput } from "../schema/updateStore.schema";
import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";

interface Params {
  storeId: string;
  requesterId: string;
  data: UpdateStoreInput;
}

export async function updateStore({ storeId, requesterId, data }: Params) {
  const hasPermission = await checkPermission({
    storeId,
    userId: requesterId,
    allowedRoles: ["OWNER"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  const existing = await prisma.store.findFirst({
    where: { slug: data.slug, NOT: { id: storeId } },
  });

  if (existing) throw new Error("Slug já em uso");

  const updated = await prisma.store.update({
    where: { id: storeId },
    data: {
      name: data.name,
      slug: data.slug,
      instagram: data.instagram,
      icon: data.icon,
      banner: data.banner,
      pix: data.pix,
      city: data.city,
      postalCode: data.postalCode,
    },
  });

  return updated;
}
