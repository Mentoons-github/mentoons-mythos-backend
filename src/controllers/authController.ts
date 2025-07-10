import catchAsync from "../utils/cathAsync";
import userAuthJoi from "../validations/userValidation";
import * as authServices from "../services/authServices";
import config from "../config/config";
import User from "../models/userModel";

export const registerUser = catchAsync(async (req, res) => {
  const { value, error } = userAuthJoi.validate(req.body);
  const data = await authServices.registerUser(value, error);
  res.cookie("token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  });
  res.status(201).json({ message: "Registration Successfull", user:data.user });
});

export const loginUser = catchAsync(async (req, res) => {
  const user = await authServices.loginUser(req.body);
  res.cookie("token", user.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ message: "Login Successfull" });
});

export const googleAuthCallback = catchAsync(async (req, res) => {
  const googleUser = req.user;
  const accessToken = await authServices.googleRegister(googleUser);

  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const redirectUrl = `${config.FRONTEND_URL}/oauth-result?status=success`;
  res.redirect(redirectUrl);
});

export const sendOtp = catchAsync(async (req, res) => {
  console.log(req.body, "body");
  await authServices.sendOtp(req.body.email);
  return res.status(200).json({ message: "Otp send successfully" });
});

export const verifyOtpHandler = catchAsync(async (req, res) => {
  await authServices.verifyOtpHandler(req.body);
  return res.status(200).json({ message: "OTP Verification successfull" });
});

export const getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  return res.status(200).json({ message: "users get", users });
});
