import { prisma } from "@/prisma/client";

export async function listUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
      store: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
      statusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}
