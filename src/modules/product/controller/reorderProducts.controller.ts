import { Request, Response } from "express";
import { reorderProducts } from "../usecase/reorderProducts.usecase";

export const reorderProductsController = async (
  req: Request,
  res: Response,
) => {
  const { storeSlug } = req.params;
  const { productIds } = req.body;

  try {
    await reorderProducts({ storeSlug, productIds });
    res.status(204).send();
    return;
  } catch (err: any) {
    res
      .status(500)
      .json({ msg: "Erro ao reordenar produtos", error: err.message });
    return;
  }
};
