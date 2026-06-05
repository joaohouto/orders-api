import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";
import { addMonths } from "@/lib/dateUtils";
import { BulkCreateMembershipsInput } from "../schema/bulkCreateMemberships.schema";
import { ForbiddenError } from "@/shared/errors";

type ResultAction = "created" | "confirmed" | "skipped";

type BulkResult = {
  email: string;
  action: ResultAction;
  reason?: string;
};

export async function bulkCreateMemberships(
  data: BulkCreateMembershipsInput,
  storeSlug: string,
  requesterId: string,
) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) throw new Error("Loja não encontrada");

  const allowed = await checkPermission({
    storeId: store.id,
    userId: requesterId,
    allowedRoles: ["OWNER", "EDIT"],
  });
  if (!allowed) throw new ForbiddenError("Acesso negado");

  const plan = await prisma.associationPlan.findFirst({
    where: { id: data.planId, storeId: store.id },
  });
  if (!plan) throw new Error("Plano não encontrado");

  const startDate = data.paymentDate;
  const endDate = addMonths(startDate, plan.durationMonths);

  // Threshold: skip if membership is active for more than 7 days beyond payment date
  const skipThreshold = addMonths(startDate, 0);
  skipThreshold.setDate(skipThreshold.getDate() + 7);

  const results: BulkResult[] = [];

  for (const email of data.emails) {
    // Find or create placeholder user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    // Check existing membership for this plan
    const existing = await prisma.membership.findFirst({
      where: { userId: user.id, planId: plan.id },
      orderBy: { createdAt: "desc" },
    });

    if (existing?.status === "PENDING") {
      // Confirm the pending payment
      await prisma.membership.update({
        where: { id: existing.id },
        data: { status: "ACTIVE", startDate, endDate },
      });
      results.push({ email, action: "confirmed" });
      continue;
    }

    if (existing?.status === "ACTIVE" && existing.endDate && existing.endDate > skipThreshold) {
      // Already genuinely active — skip
      results.push({ email, action: "skipped", reason: "Já possui associação ativa" });
      continue;
    }

    // Create new active membership (new or renewal)
    await prisma.membership.create({
      data: {
        userId: user.id,
        storeId: store.id,
        planId: plan.id,
        status: "ACTIVE",
        startDate,
        endDate,
      },
    });
    results.push({ email, action: "created" });
  }

  const summary = {
    created: results.filter((r) => r.action === "created").length,
    confirmed: results.filter((r) => r.action === "confirmed").length,
    skipped: results.filter((r) => r.action === "skipped").length,
    details: results,
  };

  return summary;
}
