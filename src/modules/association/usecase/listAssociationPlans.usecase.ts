import { prisma } from "@/prisma/client";

export async function listAssociationPlans(storeSlug: string, onlyActive = true) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) throw new Error("Loja não encontrada");

  const plans = await prisma.associationPlan.findMany({
    where: {
      storeId: store.id,
      ...(onlyActive ? { isActive: true } : {}),
    },
    include: {
      _count: { select: { memberships: { where: { status: "ACTIVE" } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  return plans.map((p) => ({
    id: p.id,
    storeId: p.storeId,
    name: p.name,
    description: p.description,
    price: p.price,
    durationMonths: p.durationMonths,
    isActive: p.isActive,
    activeMembers: p._count.memberships,
    createdAt: p.createdAt,
  }));
}
