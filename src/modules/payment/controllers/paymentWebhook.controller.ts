import { Request, Response } from "express";
import { mercadopagoClient } from "@/lib/mercadopago";
import { Payment } from "mercadopago";
import { confirmPayment } from "../usecase/confirmPayment.usecase";

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
        console.log(paymentInformation.metadata);

        const orderId = paymentInformation.metadata?.order_id;
        const payerId = paymentInformation.metadata?.payer_id;

        await confirmPayment({ orderId, payerId });
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
