import User from "../models/userModel";
import CustomError from "../utils/customError";
import { IUser } from "../interfaces/userInterface";

export const UserUpdate = async ({
  details,
  userId,
}: {
  details: Partial<IUser>;
  userId: string;
}) => {
  const user = await User.findByIdAndUpdate(userId, details, { new: true });

  if (!user) {
    throw new CustomError("User updation failed", 404);
  }

  return { user, message: "User updated successfully" };
};
