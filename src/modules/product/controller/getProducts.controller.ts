import { Request, Response } from "express";
import { getProducts } from "../usecase/getProducts.usecase";

export const getProductsController = async (req: Request, res: Response) => {
  const { storeSlug } = req.params;
  const { page = "1", limit = "10", q } = req.query;

  try {
    const result = await getProducts({
      storeSlug,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: q as string | undefined,
    });

    res.json(result);

    return;
  } catch (err: any) {
    res
      .status(500)
      .json({ msg: "Erro ao listar produtos", error: err.message });

    return;
  }
};
