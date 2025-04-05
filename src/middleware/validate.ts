import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse(req.body);
      req.body = result; // sobrescreve com os dados validados
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          msg: "Erro de validação",
          errors: err.format(),
        });
      }

      return res.status(500).json({ msg: "Erro interno ao validar dados" });
    }
  };
