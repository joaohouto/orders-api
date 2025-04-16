import { Request, Response } from "express";
import { createPayment } from "../usecase/createPayment.usecase";

export async function createPaymentController(req: Request, res: Response) {
  const user = req.user;
  const { orderId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const payment = await createPayment({
      orderId,
      requesterId: user.id,
    });

    res.json(payment);
    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
