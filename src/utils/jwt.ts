import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/config";

export const generateAccessToken = (userId: Types.ObjectId) => {
  const JWT_SECRET_KEY = config.JWT_SECRET_KEY as string;
  const payload = { userId };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  const JWT_SECRET_KEY = config.JWT_SECRET_KEY as string;
  const payload = { userId };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "7d" });
};
