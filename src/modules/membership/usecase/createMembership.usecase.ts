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

  const pendingMembership = await prisma.membership.findFirst({
    where: { userId, planId: data.planId, status: "PENDING" },
  });
  if (pendingMembership) throw new Error("Você já possui uma associação aguardando pagamento neste plano");

  const renewalThreshold = new Date();
  renewalThreshold.setDate(renewalThreshold.getDate() + 7);

  const activeMembership = await prisma.membership.findFirst({
    where: {
      userId,
      planId: data.planId,
      status: "ACTIVE",
      endDate: { gt: renewalThreshold },
    },
  });
  if (activeMembership) throw new Error("Você já possui uma associação ativa neste plano");

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
