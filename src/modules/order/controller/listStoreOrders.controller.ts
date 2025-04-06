import { Request, Response } from "express";
import { listStoreOrders } from "../usecase/listStoreOrders.usecase";

export async function getStoreOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  const storeId = req.params.storeId;

  if (!userId) return res.status(401).json({ error: "Não autenticado" });

  try {
    const orders = await listStoreOrders(storeId, userId);
    return res.json(orders);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
}
