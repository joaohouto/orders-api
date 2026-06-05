import { Request, Response } from "express";
import { updateStore } from "../usecase/updateStore.usecase";
import { updateStoreSchema } from "../schema/updateStore.schema";
import { handleError } from "@/shared/handleError";

export const updateStoreController = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const user = req.user;

  if (!user) {
    res.status(401).json({ msg: "Não autenticado" });

    return;
  }

  const parsed = updateStoreSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ msg: "Dados inválidos", error: parsed.error });

    return;
  }

  try {
    const updated = await updateStore({
      storeId,
      requesterId: user.id,
      data: parsed.data,
    });

    res.json(updated);

    return;
  } catch (err) {
    handleError(res, err);
    return;
  }
};
