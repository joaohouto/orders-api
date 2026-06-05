import { Response } from "express";
import { ForbiddenError } from "./errors";

export function handleError(res: Response, err: unknown): void {
  if (err instanceof ForbiddenError) {
    res.status(403).json({ msg: err.message });
    return;
  }
  const message = err instanceof Error ? err.message : "Erro interno";
  res.status(400).json({ msg: message });
}
