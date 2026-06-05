import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { ForbiddenError } from "@/shared/errors";

export async function deleteAssociationPlan(planId: string, userId: string) {
  const plan = await prisma.associationPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Plano não encontrado");

  const allowed = await checkPermission({
    storeId: plan.storeId,
    userId,
    allowedRoles: ["OWNER"],
  });
  if (!allowed) throw new ForbiddenError("Apenas o dono pode excluir planos");

  return prisma.associationPlan.update({
    where: { id: planId },
    data: { isActive: false },
  });
}
