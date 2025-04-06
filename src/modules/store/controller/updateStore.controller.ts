import { Request, Response } from "express";
import { updateStore } from "../usecase/updateStore.usecase";
import { updateStoreSchema } from "../schema/updateStore.schema";

export const updateStoreController = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const user = req.user;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  const parsed = updateStoreSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ msg: "Dados inválidos", error: parsed.error });
  }

  try {
    const updated = await updateStore({
      storeId,
      requesterId: user.id,
      data: parsed.data,
    });

    return res.json(updated);
  } catch (err: any) {
    const msg = err.message.includes("Slug")
      ? err.message
      : "Erro ao atualizar loja";
    return res.status(400).json({ msg });
  }
};
