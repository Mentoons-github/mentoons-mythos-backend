import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();

export const generateAccessToken = (userId: Types.ObjectId) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
  const payload = { userId };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });
};
