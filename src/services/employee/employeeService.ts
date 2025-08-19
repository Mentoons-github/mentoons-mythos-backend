import Employee from "../../models/employee/employee";
import CustomError from "../../utils/customError";

export const employeeExits = async (employeeID: string | number) => {
  try {
    const employee = await Employee.findOne({ employeeID });
    if (!employee) {
      throw new CustomError("No user found", 404);
    }
    return employee;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(error.message, 500);
    }
    throw new CustomError("Unexpected error", 500);
  }
};
