import { Request, Response } from "express";
import { listUserOrders } from "../usecase/listUserOrders.usecase";

export async function getUserOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const orders = await listUserOrders(userId);
    res.json(orders);

    return;
  } catch (err: any) {
    res.status(400).json({ error: err.message });

    return;
  }
}
