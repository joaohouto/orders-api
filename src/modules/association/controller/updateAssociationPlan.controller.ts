import { Request, Response } from "express";
import { updateAssociationPlan } from "../usecase/updateAssociationPlan.usecase";
import { updateAssociationPlanSchema } from "../schema/updateAssociationPlan.schema";
import { handleError } from "@/shared/handleError";

export async function updateAssociationPlanController(req: Request, res: Response) {
  const user = req.user;
  const { planId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parsed = updateAssociationPlanSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const plan = await updateAssociationPlan(planId, parsed.data, user.id);
    res.json(plan);
  } catch (err) {
    handleError(res, err);
  }
}
