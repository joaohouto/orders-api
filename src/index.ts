import express from "express";
import dotenv from "dotenv";

import passport from "@/auth/passport";
import authRoutes from "@/auth/auth.routes";
import userRoutes from "@/modules/user/user.routes";
import storeRoutes from "@/modules/store/store.routes";
import collaboratorRoutes from "@/modules/collaborator/collaborator.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/stores", storeRoutes);
app.use("/", collaboratorRoutes);

app.listen(3000, () => console.log("🚀 Server on http://localhost:3000"));
