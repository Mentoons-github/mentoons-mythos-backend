import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { Response } from "express";
import CustomError from "./customError";

interface Itoken {
  userId: Types.ObjectId;
  role: "user" | "employee" | "admin";
}

export const generateAccessToken = (
  userId: Types.ObjectId,
  role: "user" | "employee" | "admin" = "user"
) => {
  const JWT_SECRET_KEY = config.JWT_SECRET_KEY as string;
  const payload = { userId, role };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });
};

export const generateRefreshToken = (
  userId: Types.ObjectId,
  role: "user" | "employee" | "admin" = "user"
): string => {
  const JWT_SECRET_KEY = config.JWT_SECRET_KEY as string;
  const payload = { userId, role };
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string): Itoken => {
  const JWT_SECRET_KEY = config.JWT_SECRET_KEY as string;
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as Itoken;
  } catch {
    throw new CustomError("Invalid or expired refresh token", 401);
  }
};

export const sendAccessToken = (
  res: Response,
  token: string,
  cookieName = "token"
): void => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });
};

export const sendRefreshToken = (
  res: Response,
  token: string,
  cookieName = "refreshToken"
): void => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
