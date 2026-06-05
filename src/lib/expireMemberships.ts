import { prisma } from "@/prisma/client";

export async function expireOverdueMemberships(filter: { userId?: string; storeId?: string }) {
  await prisma.membership.updateMany({
    where: {
      ...filter,
      status: "ACTIVE",
      endDate: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });
}
