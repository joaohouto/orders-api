import { prisma } from "@/prisma/client";
import { QrCodePix } from "qrcode-pix";

export async function generateMembershipPix(membershipId: string, userId: string) {
  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
    include: {
      plan: true,
      store: { include: { owner: true } },
    },
  });

  if (!membership) throw new Error("Associação não encontrada");
  if (membership.userId !== userId) throw new Error("Você não tem permissão para pagar esta associação");
  if (membership.status !== "PENDING") throw new Error("Esta associação não pode ser paga");
  if (!membership.store.pix) throw new Error("Não há chave PIX cadastrada para esta loja");

  const qrCodePix = QrCodePix({
    version: "01",
    key: membership.store.pix,
    name: membership.store.owner.name ?? membership.store.name,
    city: membership.store.city,
    transactionId: membership.id.replace(/-/g, "").slice(0, 25),
    message: `Associacao ${membership.plan.name}`,
    cep: membership.store.postalCode,
    value: membership.plan.price.toNumber(),
  });

  const qrcode = await qrCodePix.base64();

  return {
    pix: qrCodePix.payload(),
    qrcode,
  };
}
