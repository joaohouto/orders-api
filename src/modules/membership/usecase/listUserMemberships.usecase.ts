import { prisma } from "@/prisma/client";
import { expireOverdueMemberships } from "@/lib/expireMemberships";

export async function listUserMemberships(userId: string) {
  await expireOverdueMemberships({ userId });

  return prisma.membership.findMany({
    where: { userId },
    include: {
      plan: true,
      store: { select: { id: true, name: true, slug: true, icon: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
