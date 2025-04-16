import { Request, Response } from "express";
import { listStoreOrders } from "../usecase/listStoreOrders.usecase";

export async function getStoreOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  const { storeSlug } = req.params;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const orders = await listStoreOrders(storeSlug, userId);
    res.json(orders);
    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
