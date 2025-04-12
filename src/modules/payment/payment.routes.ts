import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { createPaymentController } from "./controllers/createPayment.controller";
import { paymentWebHook } from "./controllers/paymentWebhook.controller";

const router = Router();

router.get(
  "/orders/:orderId/payment/mercadopago",
  authMiddleware,
  createPaymentController
);

router.post("/webhook/mercadopago", paymentWebHook);

export default router;
