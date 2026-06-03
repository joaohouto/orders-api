import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { addMonths } from "@/lib/dateUtils";

export type MembershipStatusUpdate = "ACTIVE" | "CANCELED" | "EXPIRED";

export async function updateMembershipStatus(
  membershipId: string,
  status: MembershipStatusUpdate,
  userId: string,
) {
  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
    include: { plan: true },
  });
  if (!membership) throw new Error("Associação não encontrada");

  const allowed = await checkPermission({
    storeId: membership.storeId,
    userId,
    allowedRoles: ["OWNER", "EDIT"],
  });
  if (!allowed) throw new Error("Acesso negado");

  const now = new Date();
  const updateData: {
    status: MembershipStatusUpdate;
    startDate?: Date;
    endDate?: Date;
  } = { status };

  if (status === "ACTIVE") {
    updateData.startDate = now;
    updateData.endDate = addMonths(now, membership.plan.durationMonths);
  }

  return prisma.membership.update({
    where: { id: membershipId },
    data: updateData,
    include: { plan: true, user: { select: { id: true, name: true, email: true } } },
  });
}
