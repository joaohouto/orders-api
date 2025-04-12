import { Request, Response } from "express";
import { removeCollaborator } from "../usecase/removeCollaborator.usecase";

export const removeCollaboratorController = async (
  req: Request,
  res: Response
) => {
  const user = req.user;
  const { storeSlug, userId } = req.params;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  try {
    const result = await removeCollaborator({
      storeSlug,
      userIdToRemove: userId,
      requesterId: user.id,
    });

    res.json(result);
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
