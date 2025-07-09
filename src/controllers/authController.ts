import catchAsync from "../utils/cathAsync";
import userAuthJoi from "../validations/userValidation";
import * as authServices from "../services/authServices";
import User from "../models/userModel";

export const registerUser = catchAsync(async (req, res) => {
  const { value, error } = userAuthJoi.validate(req.body);
  const user = await authServices.registerUser(value, error);
  res.status(201).json({ message: "Registration Successfull", user });
});

export const loginUser = catchAsync(async (req, res) => {
  const user = await authServices.loginUser(req.body);
  res.cookie("token", user.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  return res.status(200).json({ message: "Login Successfull" });
});


export const sendOtp = catchAsync(async (req,res) => {
  console.log(req.body,'body')
  await authServices.sendOtp(req.body.email)
  return res.status(200).json({message:"Otp send successfully"})
})

export const verifyOtpHandler = catchAsync (async (req,res) => {
  await authServices.verifyOtpHandler(req.body)
  return res.status(200).json({message:"OTP Verification successfull"})
})

export const getUsers = catchAsync(async(req,res) => {
  const users = await User.find()
  return res.status(200).json({message:"users get", users})
})