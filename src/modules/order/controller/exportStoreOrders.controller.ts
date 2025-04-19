import { Request, Response } from "express";
import { exportStoreOrdersUseCase } from "../usecase/exportStoreOrders.usecase";

export async function exportStoreOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  const { storeSlug } = req.params;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const csv = await exportStoreOrdersUseCase(storeSlug, userId);

    res.header("Content-Type", "text/csv");
    res.attachment(`pedidos-${storeSlug}.csv`);
    res.send(csv);

    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
