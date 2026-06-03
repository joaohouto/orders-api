import { prisma } from "@/prisma/client";

export async function listUserMemberships(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      plan: true,
      store: { select: { id: true, name: true, slug: true, icon: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
