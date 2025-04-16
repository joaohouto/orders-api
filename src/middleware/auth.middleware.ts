import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ msg: "Token ausente" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as {
      id: string;
      email: string;
      name?: string;
      avatar?: string;
    };

    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ msg: "Token inválido" });
    return;
  }
};
