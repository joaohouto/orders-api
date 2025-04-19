import { prisma } from "@/prisma/client";

type MercadoPagoPayment = {
  id: number;
  status: string;
  metadata: {
    order_id: string;
    payer_email: string;
    payer_id: string;
  };
  payer: {
    identification: { number: string; type: string };
    first_name: string | null;
    last_name: string | null;
  };
  transaction_amount: number;
  installments: number;
  payment_method_id: string;
  date_approved: string;
};

export async function savePaymentFromMercadoPago(mp: MercadoPagoPayment) {
  const payerName = [mp.payer.first_name, mp.payer.last_name]
    .filter(Boolean)
    .join(" ");

  await prisma.payment.create({
    data: {
      provider: "mercadopago",
      providerPaymentId: String(mp.id),
      status: mp.status,
      orderId: mp.metadata.order_id,
      payerEmail: mp.metadata.payer_email,
      payerId: mp.metadata.payer_id,
      payerName,
      payerDocument: mp.payer.identification.number,
      amount: mp.transaction_amount,
      method: mp.payment_method_id,
      installments: mp.installments,
      approvedAt: new Date(mp.date_approved),
    },
  });
}
