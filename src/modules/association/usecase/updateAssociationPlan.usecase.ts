import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { ForbiddenError } from "@/shared/errors";
import { UpdateAssociationPlanInput } from "../schema/updateAssociationPlan.schema";

export async function updateAssociationPlan(
  planId: string,
  data: UpdateAssociationPlanInput,
  userId: string,
) {
  const plan = await prisma.associationPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Plano não encontrado");

  const allowed = await checkPermission({
    storeId: plan.storeId,
    userId,
    allowedRoles: ["OWNER", "EDIT"],
  });
  if (!allowed) throw new ForbiddenError("Acesso negado");

  return prisma.associationPlan.update({
    where: { id: planId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: new Decimal(data.price) }),
      ...(data.durationMonths !== undefined && { durationMonths: data.durationMonths }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}
