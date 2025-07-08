import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      //Save user info to DB here
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
