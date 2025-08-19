import catchAsync from "../utils/cathAsync";
import userAuthJoi from "../validations/userValidation";
import * as authServices from "../services/authServices";
import config from "../config/config";
import User from "../models/userModel";
import bcrypt from "bcrypt";

export const registerUser = catchAsync(async (req, res) => {
  const { value, error } = userAuthJoi.validate(req.body);
  const data = await authServices.registerUser(value, res, error);
  res
    .status(201)
    .json({ message: "Registration Successfull", user: data.user });
});

export const loginUser = catchAsync(async (req, res) => {
  await authServices.loginUser(req.body, res);
  return res.status(200).json({ message: "Login Successfull" });
});

export const accessTokenGenerator = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log("no refresh token");
    return res.status(401).json({ message: "Refresh token not found" });
  }
  const accessToken = await authServices.accessTokenGenerator(
    res,
    refreshToken
  );
  res.status(200).json(accessToken);
});

export const logout = catchAsync(async (req, res) => {
  const message = await authServices.logout(res);
  console.log(message);
  res.status(200).json({ message });
});

export const googleAuthCallback = catchAsync(async (req, res) => {
  const googleUser = req.user;
  await authServices.googleRegister(googleUser, res);
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

export const forgotPassword = catchAsync(async (req, res) => {
  const message = await authServices.forgotPassword(req.body);
  res.status(200).json({ success: true, message });
});

export const getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  console.log(users, "userss");
  return res.status(200).json({ message: "users get", users });
});

export const changePassword = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId).select("+password +email");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Current password is incorrect" });
  }
  const data = {
    email: user.email,
    newPassword,
  };
  const message = await authServices.forgotPassword(data);
  res.status(200).json({ success: true, message });
});
