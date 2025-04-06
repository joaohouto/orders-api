import { Request, Response } from "express";
import { z } from "zod";
import { createProduct } from "../usecase/createProduct.usecase";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  variations: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().positive(),
      })
    )
    .min(1),
});

export const createProductController = async (req: Request, res: Response) => {
  const user = req.user;
  const storeId = req.params.storeId;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ msg: "Dados inválidos", error: parsed.error });
  }

  try {
    const product = await createProduct({
      ...parsed.data,
      requesterId: user.id,
      storeId,
    });

    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ msg: err.message });
  }
};
