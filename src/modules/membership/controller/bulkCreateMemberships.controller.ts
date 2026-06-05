import { Request, Response } from "express";
import { bulkCreateMemberships } from "../usecase/bulkCreateMemberships.usecase";
import { bulkCreateMembershipsSchema } from "../schema/bulkCreateMemberships.schema";
import { handleError } from "@/shared/handleError";

export async function bulkCreateMembershipsController(req: Request, res: Response) {
  const user = req.user;
  const { storeSlug } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parsed = bulkCreateMembershipsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const result = await bulkCreateMemberships(parsed.data, storeSlug, user.id);
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
}
