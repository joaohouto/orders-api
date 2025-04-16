import { Router } from "express";
import passport from "@/modules/auth/passport";
import { generateToken } from "@/modules/auth/jwt";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as {
      id: string;
      email: string;
      name?: string;
      avatar?: string;
    };

    const token = generateToken(user);

    res.redirect(`${process.env.WEB_CLIENT_URL}/auth?token=${token}`);

    return;
  }
);

export default router;
