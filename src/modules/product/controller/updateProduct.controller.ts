import { Request, Response } from "express";
import { updateProduct } from "../usecase/updateProduct.usecase";
import { updateProductSchema } from "../schema/updateProduct.shema";

export const updateProductController = async (req: Request, res: Response) => {
  const { storeId, productId } = req.params;
  const user = req.user;

  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ msg: "Dados inválidos", error: parsed.error });
  }

  try {
    const updated = await updateProduct({
      storeId,
      productId,
      requesterId: user.id,
      data: parsed.data,
    });

    return res.json(updated);
  } catch (err: any) {
    const msg = err.message.includes("Slug")
      ? err.message
      : "Erro ao atualizar produto";
    return res.status(400).json({ msg });
  }
};
