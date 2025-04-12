import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";

export async function listStoreOrders(storeSlug: string, userId: string) {
  const store = await prisma.store.findUnique({
    where: {
      slug: storeSlug,
    },
  });

  if (!store) throw new Error("Loja não encontrada");

  const hasPermission = await checkPermission({
    storeId: store.id,
    userId,
    allowedRoles: ["OWNER", "EDIT", "VIEW"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  const orders = await prisma.order.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}
