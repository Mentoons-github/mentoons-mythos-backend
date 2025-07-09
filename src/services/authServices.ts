import { ValidationError } from "joi";
import { IUser } from "../interfaces/userInterface";
import User from "../models/userModel";
import { passwordCompare, passwordHash } from "../utils/bcrypt";
import CustomError from "../utils/customError";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { generateOTP, saveOTP, sendOTPEmail, verifyOTP } from "../utils/otpGenerator";

export const registerUser = async (value: IUser, error?: ValidationError) => {
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const { firstName, lastName, email, password, dateOfBirth, country, about } = value;

  const existringEmail = await User.findOne({ email });
  if (existringEmail) {
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
  return user;
};

export const loginUser = async (userData: IUser) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (!user) throw new CustomError("Invalid Email id", 400);
  const validPassword = await passwordCompare(password, user.password);
  if (!validPassword) throw new CustomError("Invalid Password", 400);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id)

  return {
    _id: user._id,
    email: user.email,
    accessToken,
    refreshToken
  };
};


export const sendOtp = async(email:string) => {
  const otp = generateOTP()
  console.log(otp,'otpppp')
  saveOTP(email,otp)
  await sendOTPEmail(email, otp);
}

export const verifyOtpHandler = async({email,otp}:{email:string,otp:string}) => {
  const isValid = verifyOTP(email,otp)

  if(!isValid) throw new CustomError("Invalid or Expired OTP", 400)

}
