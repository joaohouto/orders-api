import { Request, Response } from "express";
import { createProduct } from "../usecase/createProduct.usecase";
import { schema } from "../schema/createProduct.schema";
import { handleError } from "@/shared/handleError";

export const createProductController = async (req: Request, res: Response) => {
  const user = req.user;
  const { storeSlug } = req.params;

  if (!user) {
    res.status(401).json({ msg: "Não autenticado" });
    return;
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ msg: "Dados inválidos", error: parsed.error });

    return;
  }

  try {
    const product = await createProduct({
      ...parsed.data,
      requesterId: user.id,
      storeSlug,
    });

    res.status(201).json(product);
  } catch (err) {
    handleError(res, err);
  }
};
