import { ValidationError } from "joi";
import { IUser } from "../interfaces/userInterface";
import User from "../models/userModel";
import { passwordCompare, passwordHash } from "../utils/bcrypt";
import CustomError from "../utils/customError";
import { generateAccessToken } from "../utils/jwt";

export const registerUser = async (value: IUser, error?: ValidationError) => {
  if (error) {
    throw new CustomError(error.details[0].message, 400);
  }

  const { firstName, lastName, email, password, DOB, country, about } = value;

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
    DOB,
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

  return {
    _id: user._id,
    email: user.email,
    accessToken,
  };
};
