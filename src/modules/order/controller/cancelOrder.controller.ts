import { Request, Response } from "express";
import { cancelOrderUseCase } from "../usecase/cancelOrder.usecase";

export async function cancelOrderController(req: Request, res: Response) {
  const userId = req.user?.id;
  const orderId = req.params.orderId;

  if (!userId) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  try {
    const order = await cancelOrderUseCase(orderId, userId);
    return res.json(order);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
