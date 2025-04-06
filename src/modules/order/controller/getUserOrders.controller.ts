import { Request, Response } from "express";
import { listUserOrders } from "../usecase/listUserOrders.usecase";

export async function getUserOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Não autenticado" });

  try {
    const orders = await listUserOrders(userId);
    return res.json(orders);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
