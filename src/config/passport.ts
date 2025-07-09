import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import config from "./config";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      // save or find user in DB here
      return done(null, profile);
    }
  )
);
