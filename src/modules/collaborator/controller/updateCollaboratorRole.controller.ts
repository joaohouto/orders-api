import { Request, Response } from "express";
import { updateCollaboratorRole } from "../usecase/updateCollaboratorRole.usecase";
import { z } from "zod";

import { CollaboratorRoles } from "@/shared/enums/collaboratorRole";

const bodySchema = z.object({
  role: z.enum([CollaboratorRoles.VIEW, CollaboratorRoles.EDIT]),
});

export const updateCollaboratorRoleController = async (
  req: Request,
  res: Response
) => {
  const user = req.user;
  const storeId = req.params.storeId;
  const userIdToUpdate = req.params.userId;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ msg: "Dados inválidos", error: parsed.error });
  }

  try {
    const result = await updateCollaboratorRole({
      storeId,
      userIdToUpdate,
      newRole: parsed.data.role,
      requesterId: user.id,
    });

    res.json(result);
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
