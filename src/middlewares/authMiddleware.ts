import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../utils/customError";
import config from "../config/config";
import User from "../models/userModel";
import { RequestHandler } from "express";

const userAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new CustomError("Access denied, token missing!", 401);
    }

    const secretKey = config.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new CustomError("JWT Key missing!", 500);
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new CustomError("Access Forbidden", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default userAuth;
