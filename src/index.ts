import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import passport from "@/modules/auth/passport";
import authRoutes from "@/modules/auth/auth.routes";
import userRoutes from "@/modules/user/user.routes";
import storeRoutes from "@/modules/store/store.routes";
import collaboratorRoutes from "@/modules/collaborator/collaborator.routes";
import productRoutes from "@/modules/product/product.routes";
import orderRoutes from "@/modules/order/order.routes";
import fileRoutes from "@/modules/file/file.routes";
import paymentRoutes from "@/modules/payment/payment.routes";
import { rateLimiter } from "@/middleware/rateLimit";

dotenv.config();

const ALLOWED_ORIGINS = [
  "https://vendeuu.web.app",
  /^http:\/\/localhost(:\d+)?$/,
  ...(process.env.EXTRA_CORS_ORIGINS
    ? process.env.EXTRA_CORS_ORIGINS.split(",")
    : []),
];

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (ex: mobile, curl, server-to-server)
      if (
        !origin ||
        ALLOWED_ORIGINS.some((o) =>
          typeof o === "string" ? o === origin : o.test(origin),
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS: origem não permitida"));
      }
    },
    credentials: true,
  }),
);
app.use(rateLimiter);
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/stores", storeRoutes);
app.use("/", collaboratorRoutes);
app.use("/", productRoutes);
app.use("/", orderRoutes);
app.use("/", paymentRoutes);
app.use("/", fileRoutes);

app.listen(3000, () => console.log("🚀 Server on http://localhost:3000"));
