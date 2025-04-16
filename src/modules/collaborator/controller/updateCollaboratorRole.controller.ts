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
  const { storeSlug, userId } = req.params;

  if (!user) {
    res.status(401).json({ msg: "Não autenticado" });
    return;
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ msg: "Dados inválidos", error: parsed.error });
    return;
  }

  try {
    const result = await updateCollaboratorRole({
      storeSlug,
      userIdToUpdate: userId,
      newRole: parsed.data.role,
      requesterId: user.id,
    });

    res.json(result);

    return;
  } catch (err: any) {
    res.status(403).json({ msg: err.message });

    return;
  }
};
