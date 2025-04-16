import { Request, Response } from "express";
import { updateProduct } from "../usecase/updateProduct.usecase";
import { updateProductSchema } from "../schema/updateProduct.shema";

export const updateProductController = async (req: Request, res: Response) => {
  const { storeSlug, productSlug } = req.params;
  const user = req.user;

  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ msg: "Dados inválidos", error: parsed.error });

    return;
  }

  try {
    const updated = await updateProduct({
      storeSlug,
      productSlug,
      requesterId: user.id,
      data: parsed.data,
    });

    res.json(updated);

    return;
  } catch (err: any) {
    const msg = err.message.includes("Slug")
      ? err.message
      : "Erro ao atualizar produto";

    res.status(400).json({ msg });
    return;
  }
};
