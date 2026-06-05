import { Request, Response } from "express";
import { cancelOrderUseCase } from "../usecase/cancelOrder.usecase";
import { handleError } from "@/shared/handleError";

export async function cancelOrderController(req: Request, res: Response) {
  const userId = req.user?.id;
  const orderId = req.params.orderId;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const order = await cancelOrderUseCase(orderId, userId);
    res.json(order);

    return;
  } catch (err) {
    handleError(res, err);
    return;
  }
}
