import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { CreateAssociationPlanInput } from "../schema/createAssociationPlan.schema";
import { ForbiddenError } from "@/shared/errors";

export async function createAssociationPlan(
  data: CreateAssociationPlanInput,
  storeId: string,
  userId: string,
) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new Error("Loja não encontrada");

  const allowed = await checkPermission({ storeId, userId, allowedRoles: ["OWNER", "EDIT"] });
  if (!allowed) throw new ForbiddenError("Acesso negado");

  const plan = await prisma.associationPlan.create({
    data: {
      storeId,
      name: data.name,
      description: data.description,
      price: new Decimal(data.price),
      durationMonths: data.durationMonths,
    },
  });

  return plan;
}
