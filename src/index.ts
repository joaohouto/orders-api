import express from "express";
import dotenv from "dotenv";

import passport from "@/modules/auth/passport";
import authRoutes from "@/modules/auth/auth.routes";
import userRoutes from "@/modules/user/user.routes";
import storeRoutes from "@/modules/store/store.routes";
import collaboratorRoutes from "@/modules/collaborator/collaborator.routes";
import productRoutes from "@/modules/product/product.routes";
import orderRoutes from "@/modules/order/order.routes";
import fileRoutes from "@/modules/file/file.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/stores", storeRoutes);
app.use("/", collaboratorRoutes);
app.use("/", productRoutes);
app.use("/", orderRoutes);
app.use("/", fileRoutes);

app.listen(3000, () => console.log("🚀 Server on http://localhost:3000"));
