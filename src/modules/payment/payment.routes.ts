import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { createPaymentController } from "./controllers/createPayment.controller";
import { paymentWebHook } from "./controllers/paymentWebhook.controller";
import { generatePixController } from "./controllers/generatePix.controller";

const router = Router();

router.get(
  "/orders/:orderId/payment/mercadopago",
  authMiddleware,
  createPaymentController
);

router.get(
  "/orders/:orderId/payment/pix",
  authMiddleware,
  generatePixController
);

router.post("/webhook/mercadopago", paymentWebHook);

export default router;
