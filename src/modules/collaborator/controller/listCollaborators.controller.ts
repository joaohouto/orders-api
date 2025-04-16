import { Request, Response } from "express";
import { listCollaborators } from "../usecase/listCollaborators.usecase";

export const listCollaboratorsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  const { storeSlug } = req.params;

  if (!user) {
    res.status(401).json({ msg: "Não autenticado" });
    return;
  }

  try {
    const list = await listCollaborators({
      storeSlug,
      requesterId: user.id,
    });

    res.json(list);

    return;
  } catch (err: any) {
    res.status(403).json({ msg: err.message });

    return;
  }
};
