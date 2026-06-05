import { Request, Response } from "express";
import { deleteAssociationPlan } from "../usecase/deleteAssociationPlan.usecase";
import { handleError } from "@/shared/handleError";

export async function deleteAssociationPlanController(req: Request, res: Response) {
  const user = req.user;
  const { planId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const plan = await deleteAssociationPlan(planId, user.id);
    res.json(plan);
  } catch (err) {
    handleError(res, err);
  }
}
