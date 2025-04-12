import { Request, Response } from "express";
import { listStoreOrders } from "../usecase/listStoreOrders.usecase";

export async function getStoreOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  const { storeSlug } = req.params;

  console.log(storeSlug);

  if (!userId) return res.status(401).json({ error: "Não autenticado" });

  try {
    const orders = await listStoreOrders(storeSlug, userId);
    return res.json(orders);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
}
