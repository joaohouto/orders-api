import { prisma } from "@/prisma/client";
import { QrCodePix } from "qrcode-pix";

export async function generatePix(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      store: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.userId !== userId) {
    throw new Error("Você não tem permissão para pagar este pedido");
  }

  if (order.status !== "PENDING") {
    throw new Error("O pedido não pode ser pago");
  }

  if (!order.store.pix) {
    throw new Error("Não há chave PIX de destino cadastrada para a loja");
  }

  const qrCodePix = QrCodePix({
    version: "01",
    key: order.store.pix,
    name: order.store.owner.name,
    city: order.store.city,
    transactionId: order.id,
    message: "",
    cep: order.store.postalCode,
    value: order.totalPrice.toNumber(),
  });

  const qrcode = await qrCodePix.base64();

  return {
    pix: qrCodePix.payload(),
    qrcode,
  };
}
