import { Request, Response } from "express";
import { mercadopagoClient } from "@/lib/mercadopago";
import { Payment } from "mercadopago";
import { confirmPayment } from "../usecase/confirmPayment.usecase";
import { savePaymentFromMercadoPago } from "../usecase/savePaymentFromMercadoPago.usecase";

const payment = new Payment(mercadopagoClient);

export async function paymentWebHook(req: Request, res: Response) {
  try {
    const requestBody = req.body;

    if (requestBody.type === "payment") {
      const paymentId = requestBody.data.id;

      const paymentInformation = await payment.get({
        id: paymentId,
      });

      if (paymentInformation.status === "approved") {
        const orderId = paymentInformation.metadata?.order_id;
        const payerId = paymentInformation.metadata?.payer_id;

        await confirmPayment({ orderId, payerId });
        await savePaymentFromMercadoPago({
          id: paymentInformation.id,
          status: paymentInformation.status,
          metadata: paymentInformation.metadata,
          payer: {
            identification: {
              number: paymentInformation.payer.identification.number,
              type: paymentInformation.payer.identification.type,
            },
            first_name: paymentInformation.payer.first_name,
            last_name: paymentInformation.payer.last_name,
          },
          transaction_amount: paymentInformation.transaction_amount,
          installments: paymentInformation.installments,
          payment_method_id: paymentInformation.payment_method_id,
          date_approved: paymentInformation.date_approved,
        });
      }
    }

    res.status(200).json({ ok: true });
    return;
  } catch (error) {
    console.error("Erro no webhook de pagamento:", error);
    res.status(500).json({ ok: false });
    return;
  }
}
