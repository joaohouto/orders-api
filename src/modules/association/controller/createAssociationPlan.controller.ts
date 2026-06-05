import { Request, Response } from "express";
import { createAssociationPlan } from "../usecase/createAssociationPlan.usecase";
import { createAssociationPlanSchema } from "../schema/createAssociationPlan.schema";
import { handleError } from "@/shared/handleError";

export async function createAssociationPlanController(req: Request, res: Response) {
  const user = req.user;
  const { storeId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parsed = createAssociationPlanSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const plan = await createAssociationPlan(parsed.data, storeId, user.id);
    res.status(201).json(plan);
  } catch (err) {
    handleError(res, err);
  }
}
