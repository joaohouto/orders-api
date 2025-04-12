import { prisma } from "@/prisma/client";
import { QrCodePix } from "qrcode-pix";

export async function payOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.userId !== userId) {
    throw new Error("Você não tem permissão para cancelar este pedido");
  }

  if (order.status !== "PENDING") {
    throw new Error("Este não pode ser pago");
  }

  const qrCodePix = QrCodePix({
    version: "01",
    key: "pix@joaocouto.com",
    name: "João Couto",
    city: "AQUIDAUANA",
    transactionId: order.id,
    message: "Teste",
    cep: "79200000",
    value: order.totalPrice.toNumber(),
  });

  const qrcode = await qrCodePix.base64();

  return {
    pix: qrCodePix.payload(),
    qrcode,
  };
}
