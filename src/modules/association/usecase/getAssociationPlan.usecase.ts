import { prisma } from "@/prisma/client";

export async function getAssociationPlan(planId: string) {
  const plan = await prisma.associationPlan.findFirst({
    where: { id: planId, isActive: true },
    include: {
      store: {
        select: { id: true, name: true, slug: true, icon: true, banner: true, instagram: true, accentColor: true },
      },
      _count: { select: { memberships: { where: { status: "ACTIVE" } } } },
    },
  });

  if (!plan) throw new Error("Plano não encontrado");

  return {
    id: plan.id,
    storeId: plan.storeId,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    durationMonths: plan.durationMonths,
    isActive: plan.isActive,
    activeMembers: plan._count.memberships,
    createdAt: plan.createdAt,
    store: plan.store,
  };
}
