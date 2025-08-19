import User from "../models/userModel";
import CustomError from "../utils/customError";
import { IUser } from "../interfaces/userInterface";
import Report from "../models/ReportModel";
import _ from "lodash";

//fetch all users
export const fetchAllUsers = async () => {
  const user = await User.find();
  return user;
};

//block user
export const blockUser = async (userId: string, currentUserId: string) => {
  const currentUser = await User.findById(currentUserId);
  if (currentUser?.role !== "admin") {
    throw new CustomError(`You don't have permission`, 403);
  }
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: !user.isBlocked },
    { new: true }
  );

  return updatedUser;
};

//update user
export const UserUpdate = async ({
  details,
  userId,
}: {
  details: Partial<IUser>;
  userId: string;
}) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const updates: Partial<IUser> = {};

  for (const key of Object.keys(details)) {
    const dbValue = _.get(user, key);
    const newValue = _.get(details, key);

    if (!_.isEqual(dbValue, newValue)) {
      _.set(updates, key, newValue);
    }
  }

  if (_.isEmpty(updates)) {
    throw new CustomError("No changes detected", 409);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  return { user: updatedUser!, message: "User updated successfully" };
};

//report user
export const reportUser = async ({
  reportedBy,
  userId,
  fromId,
  reason,
  from,
}: {
  reportedBy: string;
  userId: string;
  fromId?: string;
  reason: string;
  from: string;
}) => {
  if (reportedBy == userId) {
    throw new CustomError("You cant report Yourself", 400);
  }
  const existingReport = await Report.findOne({
    reportedBy,
    userId,
    from,
    fromId: fromId || null,
  });

  if (existingReport) {
    console.log(existingReport, "existing");
    throw new CustomError(
      "You've already reported this from the same source",
      400
    );
  }
  const report = await Report.create({
    reportedBy,
    userId,
    fromId,
    reason,
    from,
  });

  return report;
};

//check user exists
export const userExist = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("No user found", 404);
  }
  return user;
};
