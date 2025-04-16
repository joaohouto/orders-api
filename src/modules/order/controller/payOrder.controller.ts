import { Request, Response } from "express";
import { payOrder } from "../usecase/payOrder.usecase";

export async function payOrderController(req: Request, res: Response) {
  const user = req.user;
  const { orderId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });

    return;
  }

  try {
    const payment = await payOrder(orderId, user.id);

    res.json(payment);
    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
