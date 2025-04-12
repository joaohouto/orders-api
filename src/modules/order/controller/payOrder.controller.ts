import { Request, Response } from "express";
import { payOrder } from "../usecase/payOrder.usecase";

export async function payOrderController(req: Request, res: Response) {
  const user = req.user;
  const { orderId } = req.params;

  if (!user) return res.status(401).json({ error: "Não autenticado" });

  try {
    const payment = await payOrder(orderId, user.id);

    return res.json(payment);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
}
