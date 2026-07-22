import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return next(new CustomError("Unauthorized", 401));
  }

  const user = req.user as { role?: string };

  if (user.role !== "admin") {
    return next(new CustomError("Forbidden", 403));
  }

  next();
};
