import { Request, Response } from "express";
import { getProductBySlug } from "../usecase/getProductBySlug.usecase";

export const getProductBySlugController = async (
  req: Request,
  res: Response
) => {
  const { storeSlug, productSlug } = req.params;

  try {
    const product = await getProductBySlug(storeSlug, productSlug);
    return res.json(product);
  } catch (err: any) {
    return res
      .status(404)
      .json({ msg: err.message || "Erro ao buscar produto" });
  }
};
