import catchAsync from "../utils/cathAsync";
import userAuthJoi from "../validations/userValidation";
import * as authServices from "../services/authServices";
import config from "../config/config";
import User from "../models/userModel";
import bcrypt from "bcrypt";

//register
export const registerUser = catchAsync(async (req, res) => {
  const { value, error } = userAuthJoi.validate(req.body);
  const data = await authServices.registerUser(value, res, error);
  res
    .status(200)
    .json({ message: "Registration Successfull", user: data.user });
});

//login
export const loginUser = catchAsync(async (req, res) => {
  await authServices.loginUser(req.body, res);
  return res.status(200).json({ message: "Login Successfull" });
});

// generate access token
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

//logout
export const logout = catchAsync(async (req, res) => {
  const message = await authServices.logout(res);
  console.log(message);
  res.status(200).json({ message });
});

//google auth
export const googleAuthCallback = catchAsync(async (req, res) => {
  const googleUser = req.user;
  try {
    await authServices.googleRegister(googleUser, res);
    const redirectUrl = `${config.FRONTEND_URL}/oauth-result?status=success`;
    return res.redirect(redirectUrl);
  } catch (error: any) {
    const message = encodeURIComponent(
      error.message || "Authentication failed"
    );
    const redirectUrl = `${config.FRONTEND_URL}/oauth-result?status=error&message=${message}`;
    return res.redirect(redirectUrl);
  }
});

//send otp
export const sendOtp = catchAsync(async (req, res) => {
  console.log(req.body, "body");
  await authServices.sendOtp(req.body.email);
  return res.status(200).json({ message: "Otp send successfully" });
});

//verify otp
export const verifyOtpHandler = catchAsync(async (req, res) => {
  await authServices.verifyOtpHandler(req.body);
  return res.status(200).json({ message: "OTP Verification successfull" });
});

//forgot password
export const forgotPassword = catchAsync(async (req, res) => {
  const message = await authServices.forgotPassword(req.body);
  res.status(200).json({ success: true, message });
});

//get users
export const getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  return res.status(200).json({ message: "users get", users });
});

//change password
export const changePassword = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const message = await authServices.changePassword(userId, req.body);
  res.status(200).json({ success: true, message });
});

//delete account
export const deleteAccount = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await authServices.deleteAccount(userId, res);
  res
    .status(200)
    .json({ success: true, message: "Successfully delete this account" });
});
