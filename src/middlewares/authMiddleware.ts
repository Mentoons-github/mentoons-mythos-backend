import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../utils/customError";
import config from "../config/config";
import User from "../models/userModel";
import { RequestHandler } from "express";
import Employee from "../models/employee/employee";

const userAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("access token :", token);
    // || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new CustomError("Access denied, token missing!", 401);
    }

    const secretKey = config.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new CustomError("JWT Key missing!", 500);
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    let currentUser = null;

    if (decoded.role === "employee") {
      currentUser = await Employee.findById(decoded.userId);
    } else {
      currentUser = await User.findById(decoded.userId);
    }

    if (!currentUser) {
      throw new CustomError("Access Forbidden - Invalid user or employee", 403);
    }

    req.user = currentUser;
    // req.role = decoded.role;
    next();
  } catch (error) {
    next(error);
  }
};

export default userAuth;
