import { Router } from "express";
import passport from "@/auth/passport";
import { generateToken } from "@/auth/jwt";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user);

    res.json({ user, token });
  }
);

export default router;
