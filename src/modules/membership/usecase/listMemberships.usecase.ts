import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { expireOverdueMemberships } from "@/lib/expireMemberships";

export async function listMemberships(storeSlug: string, userId: string) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) throw new Error("Loja não encontrada");

  const allowed = await checkPermission({
    storeId: store.id,
    userId,
    allowedRoles: ["OWNER", "EDIT", "VIEW"],
  });
  if (!allowed) throw new Error("Acesso negado");

  await expireOverdueMemberships({ storeId: store.id });

  return prisma.membership.findMany({
    where: { storeId: store.id },
    include: {
      plan: true,
      user: { select: { id: true, name: true, email: true, phone: true, document: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
