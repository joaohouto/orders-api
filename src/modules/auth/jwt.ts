import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateToken(user: any) {
  return jwt.sign(user, process.env.AUTH_SECRET!, { expiresIn: "30d" });
}
