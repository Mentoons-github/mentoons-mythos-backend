import User from "../models/userModel";
import CustomError from "../utils/customError";
import { IUser } from "../interfaces/userInterface";
import Report from "../models/ReportModel";
import _ from "lodash";
import Blog from "../models/blogModel";

//fetch all users
export const fetchAllUsers = async (
  page: number,
  limit: number,
  sort: "newest" | "oldest" = "newest",
  search?: string
) => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const sortOrder = sort === "newest" ? -1 : 1;

  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });

  return {
    users,
    page,
    total,
    totalPage: Math.ceil(total / limit),
  };
};

//fetch user count 
export const fetchUserCount = async() => {
  const user = await User.find()
  return user.length
}

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

//fetch single user
export const fetchSingleUser = async (userId: string) => {
  const user = await User.findById(userId);
  const blog = await Blog.find({ writerId: userId });
  if (!user) {
    throw new CustomError("No user found", 404);
  }
  const userWithBlog = {
    ...user.toObject(),
    blogs: blog || [],
  };

  return userWithBlog;
};
