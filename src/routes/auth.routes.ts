import express from "express";
import {
  googleAuthCallback,
  loginUser,
  registerUser,
} from "../controllers/authController";
import passport from "passport";
import config from "../config/config";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: `${config.FRONTEND_URL}/oauth-result?status=failure&error=auth_start_failed`,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.FRONTEND_URL}/oauth-result?status=failure&error=auth_start_failed`,
  }),
  googleAuthCallback
);

export default router;
