import { OrderStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

import { exportStoreOrdersUseCase } from "../usecase/exportStoreOrders.usecase";

const querySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  status: z
    .union([z.nativeEnum(OrderStatus), z.array(z.nativeEnum(OrderStatus))])
    .optional()
    .transform((v) =>
      v ? (Array.isArray(v) ? v : [v]) : undefined
    ),
  buyerName: z.string().min(1).optional(),
});

export async function exportStoreOrdersController(req: Request, res: Response) {
  const userId = req.user?.id;
  const { storeSlug } = req.params;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Parâmetros inválidos", details: parsed.error.flatten() });
    return;
  }

  const { startDate, endDate, status, buyerName } = parsed.data;

  const start = startDate ? new Date(startDate + "T00:00:00.000Z") : undefined;
  const end = endDate ? new Date(endDate + "T23:59:59.999Z") : undefined;

  const suffix =
    startDate && endDate
      ? `-${startDate}-a-${endDate}`
      : startDate
        ? `-desde-${startDate}`
        : endDate
          ? `-ate-${endDate}`
          : "";

  try {
    const csv = await exportStoreOrdersUseCase(storeSlug, userId, {
      startDate: start,
      endDate: end,
      status,
      buyerName,
    });

    res.header("Content-Type", "text/csv");
    res.attachment(`pedidos-${storeSlug}${suffix}.csv`);
    res.send(csv);

    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
