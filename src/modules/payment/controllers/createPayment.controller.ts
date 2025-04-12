import { Request, Response } from "express";
import { createPayment } from "../usecase/createPayment.usecase";

export async function createPaymentController(req: Request, res: Response) {
  const user = req.user;
  const { orderId } = req.params;

  if (!user) return res.status(401).json({ error: "Não autenticado" });

  try {
    const payment = await createPayment({
      orderId,
      requesterId: user.id,
    });

    return res.json(payment);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
}
