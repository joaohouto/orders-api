import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";

export async function listStoreOrders(storeId: string, userId: string) {
  const hasPermission = await checkPermission({
    storeId,
    userId,
    allowedRoles: ["OWNER", "EDIT", "VIEW"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  const orders = await prisma.order.findMany({
    where: {
      storeId,
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
