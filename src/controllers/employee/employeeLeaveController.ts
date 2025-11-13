import * as EmployeeLeaveService from "../../services/employee/employeeLeaveService";
import catchAsync from "../../utils/cathAsync";

export const applyLeave = catchAsync(async (req, res) => {
  const employeeId = req.user._id;
  const leaveData = await EmployeeLeaveService.applyLeave(employeeId, req.body);
  res.status(200).json({ message: "Leave applied successfully", leaveData });
});

// get employee leave requests
export const getEmployeeLeaveRequests = catchAsync(async (req, res) => {
  const employeeId = req.params.employeeId || req.user._id;
  const page = parseFloat(req.query.page as string) || 1;
  const limit = parseFloat(req.query.limit as string) || 10;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const status = (req.query.status as string) || "";
  const leaveRequests = await EmployeeLeaveService.getEmployeeLeaveRequests(
    employeeId,
    page,
    limit,
    sort,
    status,
    search
  );

  res
    .status(200)
    .json({ message: "Fetched employee leave request", ...leaveRequests });
});

// get all leave requests
export const getAllLeaveRequests = catchAsync(async (req, res) => {
  const page = parseFloat(req.query.page as string) || 1;
  const limit = parseFloat(req.query.limit as string) || 10;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const status = (req.query.status as string) || "";

  const leaveRequests = await EmployeeLeaveService.getAllLeaveRequests(
    page,
    limit,
    sort,
    status,
    search
  );
  res.status(200).json({
    message: "Successfully fetched all leave requests",
    ...leaveRequests,
  });
});

//single leave request
export const getSingleLeaveRequest = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const leaveRequest = await EmployeeLeaveService.getSingleLeaveRequest(
    requestId
  );
  res.status(200).json({
    message: "Single leave request successfully fetched",
    leaveRequest,
  });
});

// update leave status
export const updateLeaveStatus = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const { status, rejectReason } = req.body;
  const leaveRequest = await EmployeeLeaveService.updateLeaveStatus(requestId, {
    status,
    rejectReason,
  });
  res
    .status(200)
    .json({ message: `Leave successfully ${status}`, leaveRequest });
});
