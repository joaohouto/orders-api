import rateLimit from "express-rate-limit";
import { RequestHandler } from "express";

export const rateLimiter: RequestHandler =
  process.env.RATE_LIMIT_ENABLED === "true"
    ? rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          msg: "Muitas requisições. Tente novamente em alguns minutos.",
        },
      })
    : (_req, _res, next) => next();
