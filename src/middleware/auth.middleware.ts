import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ msg: "Token ausente" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ msg: "Token inválido" });
  }
};
