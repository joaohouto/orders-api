import express, { Request, Response } from "express";

import { ExpressAuth } from "@auth/express"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/database/prisma"
import Google from "@auth/express/providers/google"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.set("trust proxy", true)
app.use(
  "/auth/*",
  ExpressAuth({
    providers: [Google],
    adapter: PrismaAdapter(prisma),
  })
)

// callback url [origin]/auth/callback/google

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Node.js + TypeScript API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
