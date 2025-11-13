import catchAsync from "../../utils/cathAsync";
import * as AttendanceService from "../../services/employee/attendanceService";

//get todays attendance
export const getTodayAttendace = catchAsync(async (req, res) => {
  const employeeId = req.params.employeeId || req.user._id;
  console.log(employeeId);
  const attendance = await AttendanceService.getTodayAttendace(employeeId);
  res.status(200).json({ message: "Fetched toays attendance", attendance });
});

//check in
export const checkIn = catchAsync(async (req, res) => {
  const employee = req.user;
  const attendance = await AttendanceService.checkIn(employee._id);
  res.status(200).json({ message: "Check-In successfull", attendance });
});

//checkOut
export const checkOut = catchAsync(async (req, res) => {
  const employee = req.user;
  const attendance = await AttendanceService.checkOut(employee._id);
  res.status(200).json({ message: "Check-Out successfull", attendance });
});

//get employee attendance
export const getEmployeeAttendance = catchAsync(async (req, res) => {
  const employeeId = req.params.employeeId || req.user._id;
  const lastFetchedDate = req.query.lastFetchedDate as string;
  const limit = parseInt(req.query.limit as string) || 50;
  const filter = (req.query.filter as string) || "";
  const start = req.query.start as string;
  const end = req.query.end as string;

  const attendanceData = await AttendanceService.getEmployeeAttendance(
    employeeId,
    lastFetchedDate,
    limit,
    filter,
    start,
    end
  );
  res.status(200).json({
    message: "Fetched employee attendance successfully",
    ...attendanceData,
  });
});

// allemployee today attendance
export const getTodayAttendanceAllEmployees = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const search = req.query.search as string;
  const attendanceData = await AttendanceService.getTodayAttendanceAllEmployees(
    search,
    limit,
    page
  );
  res.status(200).json({
    message: "Fetched employee attendance successfully",
    ...attendanceData,
  });
});

//edit attendance
export const editAttendanceDetails = catchAsync(async (req, res) => {
  const { attendanceId } = req.params;

  const edited = await AttendanceService.editAttendanceDetails(
    attendanceId,
    req.body
  );
  res
    .status(200)
    .json({ message: "Attendancd details successfully edited", edited });
});

// last fivedays summary
export const getLastFiveDaysAttendanceSummary = catchAsync(async (req, res) => {
  const details = await AttendanceService.getLastFiveDaysAttendanceSummary();
  res
    .status(200)
    .json({ message: "Successfully fetched last five days summary", details });
});
