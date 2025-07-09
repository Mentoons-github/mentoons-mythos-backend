import catchAsync from "../utils/cathAsync";
import userAuthJoi from "../validations/userValidation";
import * as authServices from "../services/authServices";
import config from "../config/config";

export const registerUser = catchAsync(async (req, res) => {
  const { value, error } = userAuthJoi.validate(req.body);
  const user = await authServices.registerUser(value, error);
  res.status(201).json({ message: "Registration Successfull", user });
});

export const loginUser = catchAsync(async (req, res) => {
  const user = await authServices.loginUser(req.body);
  return res.status(200).json({ message: "Login Successfull", user });
});

export const googleAuthCallback = catchAsync(async (req, res) => {
  const googleUser = req.user;
  const accessToken = await authServices.googleRegister(googleUser);

  res.cookie("authToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const redirectUrl = `${config.FRONTEND_URL}/oauth-result?status=success`;
  res.redirect(redirectUrl);
});
