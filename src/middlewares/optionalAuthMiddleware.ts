import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

export const optionalAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next();
    }

    const secretKey = config.JWT_SECRET_KEY;

    if (!secretKey) {
      return next();
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    next();
  }
};
