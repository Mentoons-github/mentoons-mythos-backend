import { Request, Response, NextFunction } from "express";
import config from "../config/config";

const globalErrorHandling = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.log("error got :", message);

  res.status(statusCode).json({
    success: false,
    message,
    stack: config.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandling;
