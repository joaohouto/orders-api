import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { prisma } from "@/prisma/client";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      if (!profile.emails?.[0].value) {
        console.log("[dev] No profile email found!");
        return;
      }

      const user = {
        name: profile.displayName,
        email: profile.emails?.[0].value,
        avatar: profile.photos?.[0].value,
      };

      const upsertUser = await prisma.user.upsert({
        where: {
          email: user.email,
        },
        update: {
          avatar: user.avatar,
        },
        create: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });

      return done(null, upsertUser);
    }
  )
);

export default passport;
