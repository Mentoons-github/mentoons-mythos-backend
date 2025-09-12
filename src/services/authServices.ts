import { ValidationError } from "joi";
import { Google_userInterface, IUser } from "../interfaces/userInterface";
import User from "../models/userModel";
import { passwordCompare, passwordHash } from "../utils/bcrypt";
import CustomError from "../utils/customError";
import {
  cookieOptions,
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  generateOTP,
  saveOTP,
  sendOTPEmail,
  verifyOTP,
} from "../utils/otpGenerator";
import { Response } from "express";

export const registerUser = async (
  value: IUser,
  res: Response,
  error?: ValidationError
) => {
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const { firstName, lastName, email, password, dateOfBirth, country, about } =
    value;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new CustomError("email Already registered", 400);
  }

  const hashedPassword = await passwordHash(password);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dateOfBirth,
    country,
    about,
  });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);

  return { user, accessToken, refreshToken };
};

export const loginUser = async (userData: IUser, res: Response) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (user?.isGoogleUser && !user.password) {
    throw new CustomError(
      "This email is registered via Google login. Please use 'Sign in with Google' instead, or add password from 'Forgot your password'",
      400
    );
  }
  if (!user) throw new CustomError("Invalid Email id", 400);
  const validPassword = await passwordCompare(password, user.password);
  if (!validPassword) throw new CustomError("Invalid Password", 400);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);
  return {
    _id: user._id,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

export const accessTokenGenerator = async (
  res: Response,
  refToken: string
): Promise<object> => {
  const payload = verifyRefreshToken(refToken);
  if (!payload.userId) throw new CustomError("Unauthorized !", 401);
  const newAccessToken = generateAccessToken(payload.userId);
  sendAccessToken(res, newAccessToken);
  return { accessToken: newAccessToken };
};

export const logout = async (res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  return "Logout Successfully";
};

export const googleRegister = async (
  googleUser: Google_userInterface,
  res: Response
) => {
  const email = googleUser.emails?.[0]?.value;
  const userName = googleUser.displayName;
  const profilePicture = googleUser.photos?.[0]?.value || null;

  let user = await User.findOne({ email });

  if (!user) {
    const [firstName, ...rest] = userName.split(" ");
    const lastName = rest.join(" ") || "";

    user = await User.create({
      firstName,
      lastName,
      email,
      profilePicture,
      password: null,
      isGoogleUser: true,
    });
  }

  const accessToken = generateAccessToken(user?._id);
  const refreshToken = generateRefreshToken(user._id);
  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);

  return accessToken;
};

export const sendOtp = async (email: string) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new CustomError("Email already Registered", 400);
  }
  const otp = generateOTP();
  saveOTP(email, otp);
  await sendOTPEmail(email, otp);
};

export const verifyOtpHandler = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const result = verifyOTP(email, otp);

  if (result.status === "expired") {
    throw new CustomError("OTP has expired. Please request a new one.", 400);
  }

  if (result.status === "invalid") {
    throw new CustomError(
      "Invalid OTP. Please check the code and try again.",
      400
    );
  }
};

export const forgotPassword = async ({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Email Not Registered", 400);
  }

  if (newPassword.length < 6) {
    throw new CustomError("Password should have at least 6 characters", 400);
  }
  if (newPassword.length > 10) {
    throw new CustomError("Password cannot exceed 10 characters", 400);
  }

  console.log(newPassword.length);

  user.password = await passwordHash(newPassword);
  await user.save();

  return "Password reset successful";
};
