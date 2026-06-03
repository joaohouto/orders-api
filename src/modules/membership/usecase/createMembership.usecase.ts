import { prisma } from "@/prisma/client";
import { CreateMembershipInput } from "../schema/createMembership.schema";

export async function createMembership(
  data: CreateMembershipInput,
  storeSlug: string,
  userId: string,
) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) throw new Error("Loja não encontrada");

  const plan = await prisma.associationPlan.findFirst({
    where: { id: data.planId, storeId: store.id, isActive: true },
  });
  if (!plan) throw new Error("Plano não encontrado ou inativo");

  const existing = await prisma.membership.findFirst({
    where: { userId, planId: data.planId, status: { in: ["PENDING", "ACTIVE"] } },
  });
  if (existing) throw new Error("Você já possui uma associação ativa ou pendente neste plano");

  const membership = await prisma.membership.create({
    data: {
      userId,
      storeId: store.id,
      planId: data.planId,
      status: "PENDING",
    },
    include: { plan: true, user: true },
  });

  return membership;
}
