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
import Employee from "../models/employee/employee";

// register
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
  const accessToken = generateAccessToken(user._id, "user");
  const refreshToken = generateRefreshToken(user._id, "user");
  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);

  return { user, accessToken, refreshToken };
};

//login
export const loginUser = async (userData: IUser, res: Response) => {
  const { email, password } = userData;

  // ✅ Find user and employee in parallel
  const [user, employee] = await Promise.all([
    User.findOne({ email }),
    Employee.findOne({ email }),
  ]);

  // ❌ If neither found
  if (!user && !employee) {
    throw new CustomError("Invalid Email ID", 400);
  }

  // ✅ Handle blocked users
  if (user?.isBlocked) {
    throw new CustomError("You have been blocked. Please contact admin.", 400);
  }

  // ✅ Handle Google login case
  if (user?.isGoogleUser && !user.password) {
    throw new CustomError(
      "This email is registered via Google login. Please use 'Sign in with Google' or reset your password.",
      400
    );
  }

  let account: any = null;
  let role: string = "user";

  // ✅ If both exist (check which password matches)
  if (user && employee) {
    const isUserMatch = await passwordCompare(password, user.password);
    const isEmployeeMatch = await passwordCompare(password, employee.password);

    if (isEmployeeMatch) {
      account = employee;
      role = "employee";
    } else if (isUserMatch) {
      account = user;
      role = user.role || "user";
    } else {
      throw new CustomError("Invalid Password", 400);
    }
  }

  // ✅ If only user exists
  else if (user) {
    const isUserMatch = await passwordCompare(password, user.password);
    if (!isUserMatch) throw new CustomError("Invalid Password", 400);
    account = user;
    role = user.role || "user";
  }

  // ✅ If only employee exists
  else if (employee) {
    const isEmployeeMatch = await passwordCompare(password, employee.password);
    if (!isEmployeeMatch) throw new CustomError("Invalid Password", 400);
    account = employee;
    role = "employee";
  }

  // ✅ Generate tokens
  const accessToken = generateAccessToken(account._id, role);
  const refreshToken = generateRefreshToken(account._id, role);

  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);

  // ✅ Return login details
  return {
    _id: account._id,
    email: account.email,
    role,
    accessToken,
    refreshToken,
  };
};

// generate acceess token
export const accessTokenGenerator = async (
  res: Response,
  refToken: string
): Promise<object> => {
  const payload = verifyRefreshToken(refToken);
  if (!payload.userId) throw new CustomError("Unauthorized !", 401);
  const newAccessToken = generateAccessToken(payload.userId, payload.role);
  sendAccessToken(res, newAccessToken);
  return { accessToken: newAccessToken };
};

//logout
export const logout = async (res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  return "Logout Successfully";
};

// google register
export const googleRegister = async (
  googleUser: Google_userInterface,
  res: Response
) => {
  const email = googleUser.emails?.[0]?.value;
  const userName = googleUser.displayName;
  const profilePicture = googleUser.photos?.[0]?.value || null;

  let user = await User.findOne({ email });

  if (user?.isBlocked) {
    throw new CustomError(
      "You has been blocked. Please contact mentoonsmythos admin",
      400
    );
  }

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

  const accessToken = generateAccessToken(user?._id, "user");
  const refreshToken = generateRefreshToken(user._id, "user");
  sendAccessToken(res, accessToken);
  sendRefreshToken(res, refreshToken);

  return accessToken;
};

//send otp
export const sendOtp = async (email: string) => {
  const userExists = await User.findOne({ email });
  console.log(userExists, "existsssssss");
  if (userExists) {
    throw new CustomError("Email already Registered", 400);
  }
  const otp = generateOTP();
  saveOTP(email, otp);
  await sendOTPEmail(email, otp);
};

//very otp
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

// forgot password
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

  user.password = await passwordHash(newPassword);
  await user.save();
  return "Password reset successful";
};

// change password
export const changePassword = async (
  userId: string,
  {
    currentPassword,
    newPassword,
  }: { currentPassword: string; newPassword: string }
) => {
  const [user, employee] = await Promise.all([
    User.findById(userId).select("email password"),
    Employee.findById(userId).select("email password"),
  ]);
  if (!user && !employee) {
    throw new CustomError("Invalid Email ID", 400);
  }
  if (user) {
    const isUserMatch = await passwordCompare(currentPassword, user.password);
    if (!isUserMatch) throw new CustomError("Invalid Password", 400);
    user.password = await passwordHash(newPassword);
    await user.save();
  } else if (employee) {
    const isEmployeeMatch = await passwordCompare(
      currentPassword,
      employee.password
    );
    if (!isEmployeeMatch) throw new CustomError("Invalid Password", 400);
    employee.password = await passwordHash(newPassword);
    await employee.save();
  }
  return "Password reset successful";
};

// delete account
export const deleteAccount = async (userId: string, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  await User.findByIdAndDelete(userId);
};
