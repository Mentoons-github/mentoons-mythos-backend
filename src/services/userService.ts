import User from "../models/userModel";
import CustomError from "../utils/customError";
import { IUser } from "../interfaces/userInterface";
import Report from "../models/ReportModel";

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

export const reportUser = async ({
  reportedBy,
  userId,
  fromId,
  reason,
  from
}: {
  reportedBy: string;
  userId: string;
  fromId?: string;
  reason: string;
  from:string;
}) => {
  if(reportedBy == userId){
    throw new CustomError("You cant report Yourself", 400)
  }
  const report = await Report.create({
    reportedBy,
    userId,
    fromId,
    reason,
    from
  })

  return report
};
