import { Request, Response } from "express";
import { listAssociationPlans } from "../usecase/listAssociationPlans.usecase";

export async function listAssociationPlansController(req: Request, res: Response) {
  const { storeSlug } = req.params;
  const onlyActive = req.query.all !== "true";

  try {
    const plans = await listAssociationPlans(storeSlug, onlyActive);
    res.json(plans);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}
