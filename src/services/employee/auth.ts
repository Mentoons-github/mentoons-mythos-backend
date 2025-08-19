import { Response } from "express";
import Employee from "../../models/employee/employee";
import CustomError from "../../utils/customError";
import {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../../utils/jwt";
import { employeeExits } from "./employeeService";
import { IEmployee } from "../../interfaces/employee";

export const passwordCheck = async (
  employeeId: string | number,
  password: string
) => {
  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      throw new CustomError("No user found", 404);
    }
    const isMatch = await employee.comparePassword(password);

    if (!isMatch) {
      throw new CustomError("Password is incorrect", 401);
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const loginEmployee = async (body: IEmployee, res: Response) => {
  try {
    const { employeeID, password } = body;
    const employee = await employeeExits(employeeID)!;
    await passwordCheck(employeeID, password);
    const accessToken = generateAccessToken(employee._id, "employee");
    const refreshToken = generateRefreshToken(employee._id, "employee");
    sendAccessToken(res, accessToken, "employeeToken");
    sendRefreshToken(res, refreshToken, "employeeRefreshToken");
    return {
      _id: employee._id,
      email: employee.email,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
  }
};
