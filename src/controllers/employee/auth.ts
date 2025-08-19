import Employee from "../../models/employee/employee";
import { loginEmployee } from "../../services/employee/auth";
import catchAsync from "../../utils/cathAsync";

export const employeeLogin = catchAsync(async (req, res) => {
  await loginEmployee(req.body, res);
  return res.status(200).json({ message: "Login Successful" });
});
