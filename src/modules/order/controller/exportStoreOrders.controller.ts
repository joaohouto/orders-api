import { Request, Response } from "express";
import { exportStoreOrdersUseCase } from "../usecase/exportStoreOrders.usecase";

export async function exportStoreOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  const { storeSlug } = req.params;
  const { startDate, endDate } = req.query;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const csv = await exportStoreOrdersUseCase(storeSlug, userId, start, end);

    res.header("Content-Type", "text/csv");
    res.attachment(`pedidos-${storeSlug}.csv`);
    res.send(csv);

    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
