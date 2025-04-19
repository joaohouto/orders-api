import { Request, Response } from "express";
import { getOrderByIdUseCase } from "../usecase/getOrderById.usecase";

export async function getOrderById(req: Request, res: Response) {
  const userId = req.user?.id;
  const { orderId } = req.params;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const order = await getOrderByIdUseCase(orderId, userId);
    res.json(order);
    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
