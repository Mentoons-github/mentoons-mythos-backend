import Report from "../models/ReportModel";
import CustomError from "../utils/customError";

//fetch all reports
import User from "../models/userModel";

export const fetchReports = async (
  page: number,
  limit: number,
  from?: string | null,
  sort: "newest" | "oldest" = "newest",
  search?: string
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
    .populate("userId", "firstName lastName email profilePicture")
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
    .populate("userId", "firstName lastName email profilePicture")
    .populate("reportedBy", "firstName lastName email profilePicture");

  return report;
};

//delete reports
export const deleteReports = async (reportId: string) => {
  const deleted = await Report.findByIdAndDelete(reportId);
  if (!deleted) throw new CustomError("Report not found in DB", 400);
  return deleted;
};
