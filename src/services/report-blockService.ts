import Report from "../models/ReportModel";
import CustomError from "../utils/customError";

//fetch all reports
import User from "../models/userModel";
import BlogV2 from "../models/BlogV2Model";
import CommentV2 from "../models/commentV2Model";
import Block from "../models/blockModel";

export const fetchReports = async (
  page: number,
  limit: number,
  from?: string | null,
  sort: "newest" | "oldest" = "newest",
  search?: string,
) => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (from && from !== "All") {
    query.from = from;
  }

  let userIds: string[] = [];

  // step 1: if searching, get userIds that match firstName, lastName, email
  if (search) {
    const users = await User.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    userIds = users.map((u) => u._id.toString());

    // step 2: add to report query
    query.$or = [
      { userId: { $in: userIds } },
      { reportedBy: { $in: userIds } },
      { from: { $regex: search, $options: "i" } },
      { fromId: { $regex: search, $options: "i" } },
    ];
  }

  const sortOrder = sort === "newest" ? -1 : 1;

  const total = await Report.countDocuments(query);

  const reports = await Report.find(query)
    .skip(skip)
    .limit(limit)
    .populate("reportedUser", "firstName lastName email profilePicture")
    .populate("reportedBy", "firstName lastName email profilePicture")
    .sort({ createdAt: sortOrder });

  return {
    reports,
    page,
    total,
    totalPage: Math.ceil(total / limit),
  };
};

//fetch single reports
export const fetchSingleReports = async (reportId: string) => {
  const report = await Report.findById(reportId)
    .populate("reportedUser", "firstName lastName email profilePicture")
    .populate("reportedBy", "firstName lastName email profilePicture");

  return report;
};

//delete reports
export const deleteReports = async (reportId: string) => {
  const deleted = await Report.findByIdAndDelete(reportId);
  if (!deleted) throw new CustomError("Report not found in DB", 400);
  return deleted;
};

export const takeReportAction = async (reportId: string, action: string) => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new CustomError("Report not found", 404);
  }

  // BLOG ACTIONS
  if (report.targetType === "blog") {
    const blog = await BlogV2.findById(report.targetId);

    if (!blog) {
      throw new CustomError("Blog not found", 404);
    }

    blog.moderationStatus = "active";

    if (action === "delete") {
      blog.moderationStatus = "deleted";

      report.actionTaken = "deleted";
    }

    if (action === "hide") {
      blog.moderationStatus = "hidden";

      report.actionTaken = "hidden";
    }

    await blog.save();
  }

  // COMMENT ACTIONS
  if (report.targetType === "comment") {
    const comment = await CommentV2.findById(report.targetId);

    if (!comment) {
      throw new CustomError("Comment not found", 404);
    }

    comment.moderationStatus = "active";

    if (action === "delete") {
      comment.moderationStatus = "deleted";

      report.actionTaken = "deleted";
    }

    if (action === "hide") {
      comment.moderationStatus = "hidden";

      report.actionTaken = "hidden";
    }

    await comment.save();
  }

  // USER WARNING
  if (action === "warn_user") {
    const user = await User.findById(report.reportedUser);

    if (user) {
      user.warningCount = (user.warningCount || 0) + 1;

      await user.save();
    }

    report.actionTaken = "warning_sent";
  }

  // USER BAN
  if (action === "ban_user") {
    const user = await User.findById(report.reportedUser);

    if (user) {
      user.isBlocked = true;

      await user.save();
    }

    report.actionTaken = "user_banned";
  }

  // IGNORE REPORT
  if (action === "ignore") {
    report.actionTaken = "ignore";
  }

  report.status = "resolved";

  await report.save();

  return {
    message: `Report action '${action}' completed successfully`,
  };
};

// block user
export const blockUser = async (
  blockedBy: string,
  blockedUser: string,
  reason: string,
) => {
  if (blockedBy == blockedUser) {
    throw new CustomError("You cant report Yourself", 400);
  }
  const existingBlock = await Block.findOne({
    blockedBy,
    blockedUser,
  });

  if (existingBlock) {
    console.log(existingBlock, "existing");
    throw new CustomError("You've already blocked this user", 400);
  }
  const block = await Block.create({
    blockedBy,
    blockedUser,
    reason,
  });

  return block;
};

// fetch all blocked data
export const allBlockedDeatails = async () => {
  const blockData = await Block.find()
    .populate("blockedUser", "firstName lastName email profilePicture")
    .populate("blockedBy", "firstName lastName email profilePicture");
  return blockData;
};
