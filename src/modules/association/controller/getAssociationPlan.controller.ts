import { Request, Response } from "express";
import { getAssociationPlan } from "../usecase/getAssociationPlan.usecase";

export async function getAssociationPlanController(req: Request, res: Response) {
  const { planId } = req.params;

  try {
    const plan = await getAssociationPlan(planId);
    res.json(plan);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}
