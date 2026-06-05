import { Router } from "express";
import { randomUUID } from "crypto";
import passport from "@/modules/auth/passport";
import { generateToken } from "@/modules/auth/jwt";

const router = Router();

const pendingCodes = new Map<string, { token: string; expiresAt: number }>();

function cleanExpiredCodes() {
  const now = Date.now();
  for (const [code, data] of pendingCodes.entries()) {
    if (data.expiresAt < now) pendingCodes.delete(code);
  }
}

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
    const code = randomUUID();

    cleanExpiredCodes();
    pendingCodes.set(code, { token, expiresAt: Date.now() + 60_000 });

    res.redirect(`${process.env.WEB_CLIENT_URL}/auth?code=${code}`);
    return;
  }
);

router.get("/exchange-code", (req, res) => {
  const { code } = req.query as { code?: string };

  if (!code) {
    res.status(400).json({ msg: "Código ausente" });
    return;
  }

  const pending = pendingCodes.get(code);

  if (!pending || pending.expiresAt < Date.now()) {
    pendingCodes.delete(code);
    res.status(401).json({ msg: "Código inválido ou expirado" });
    return;
  }

  pendingCodes.delete(code);
  res.json({ token: pending.token });
});

export default router;
