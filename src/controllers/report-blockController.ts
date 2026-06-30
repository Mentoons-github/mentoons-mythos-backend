import * as ReportBlock from "../services/report-blockService";
import catchAsync from "../utils/cathAsync";

export const fetchReports = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 0;
  const from = (req.query.from as string) || null;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";

  const reports = await ReportBlock.fetchReports(
    page,
    limit,
    from,
    sort,
    search,
  );

  res.status(200).json({
    success: true,
    message: "Reports successfully fetched",
    ...reports,
  });
});

//fetch single report
export const fetchSingleReports = catchAsync(async (req, res) => {
  const { reportId } = req.params;
  const report = await ReportBlock.fetchSingleReports(reportId);
  res.status(200).json({
    succes: true,
    message: "Fetched the single report details",
    report,
  });
});

//delete report
export const deleteReports = catchAsync(async (req, res) => {
  const { reportId } = req.params;
  const deleted = await ReportBlock.deleteReports(reportId);
  res.status(200).json({
    succes: true,
    message: "Deleted the report details",
    deleted,
  });
});

//take report actions
export const takeReportAction = catchAsync(async (req, res) => {
  const { reportId } = req.params;
  const { action } = req.body;

  const response = await ReportBlock.takeReportAction(reportId, action);

  return res.status(200).json({
    success: true,
    message: response.message,
  });
});

//block user
export const blockUser = catchAsync(async (req, res) => {
  const blockedBy = req.user._id;
  const { reason, blockedUser } = req.body;
  const report = await ReportBlock.blockUser(blockedBy, blockedUser, reason);

  res.status(201).json({ message: "Blocked this user", report });
});

//fetch all block details
export const allBlockedDeatails = catchAsync(async (req, res) => {
  const blockedData = await ReportBlock.allBlockedDeatails();
  res.status(200).json({ message: "All blocked data fetched", blockedData });
});
