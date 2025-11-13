import mongoose from "mongoose";
import Attendance from "../../models/employee/attendanceModel";
import CustomError from "../../utils/customError";
import { IAttendance } from "../../interfaces/employee/attendance & leave";

const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// get todays attendance
export const getTodayAttendace = async (employeeId: string) => {
  const today = getTodayDate();
  const attendance = await Attendance.findOne({
    employeeId,
    date: today,
  });
  if (!attendance) {
    return {
      checkIn: null,
      checkOut: null,
      workHours: null,
      status: "Absent",
    };
  }

  return attendance;
};

// Check-In
export const checkIn = async (employeeId: string) => {
  const today = getTodayDate();
  const now = new Date();

  const day = now.getDay();
  if (day === 0 || day === 6) {
    throw new CustomError("Cannot check in on weekends", 400);
  }

  const existing = await Attendance.findOne({ employeeId, date: today });
  if (existing && existing.checkIn) {
    throw new CustomError("Already checked in", 400);
  }

  const lateThreshold = new Date(now);
  lateThreshold.setHours(10, 0, 0, 0);
  const halfDayThreshold = new Date(now);
  halfDayThreshold.setHours(12, 0, 0, 0);
  let status: "Present" | "Late" | "Half Day" = "Present";
  if (now > lateThreshold && now <= halfDayThreshold) {
    status = "Late";
  } else if (now > halfDayThreshold) {
    status = "Half Day";
  }
  if (existing) {
    existing.checkIn = now;
    existing.status = status;
    await existing.save();
    return existing;
  }

  const attendance = await Attendance.create({
    employeeId,
    date: today,
    checkIn: now,
    status,
  });

  return attendance;
};

// Check-Out
export const checkOut = async (employeeId: string) => {
  const today = getTodayDate();

  const attendance = await Attendance.findOne({ employeeId, date: today });
  if (!attendance) throw new CustomError("No check-in found", 400);
  if (!attendance.checkIn) {
    throw new CustomError("Cannot check out without check-in", 400);
  }
  if (attendance.checkOut) throw new CustomError("Already checked out", 400);

  attendance.checkOut = new Date();

  const checkInTime = new Date(attendance.checkIn).getTime();
  const checkOutTime = new Date(attendance.checkOut).getTime();

  const totalMinutes = (checkOutTime - checkInTime) / (1000 * 60);
  const decimalHours = Number((totalMinutes / 60).toFixed(2));

  attendance.totalHours = decimalHours;

  if (decimalHours < 4) attendance.status = "Half Day";
  

  await attendance.save();
  return attendance;
};

// get employee attendance
export const getEmployeeAttendance = async (
  employeeId: string,
  lastFetchedDate?: string,
  limit: number = 50,
  filter?: string,
  start?: string,
  end?: string
) => {
  const objectId = new mongoose.Types.ObjectId(employeeId);
  const query: any = { employeeId: objectId };
  const today = new Date();
  let startDate: Date | null = null;
  let endDateVal: Date | null = null;

  switch (filter) {
    case "last7":
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      endDateVal = today;
      break;
    case "last30":
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
      endDateVal = today;
      break;
    case "thisWeek": {
      const currentDay = today.getDay();
      startDate = new Date(today);
      startDate.setDate(today.getDate() - currentDay);
      endDateVal = today;
      break;
    }
    case "thisMonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDateVal = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "all":
      startDate = null;
      endDateVal = null;
      break;
    default:
      if (start && end) {
        startDate = new Date(start);
        endDateVal = new Date(end);
      }
  }

  const dateQuery: any = {};
  if (startDate) dateQuery.$gte = startDate;
  if (endDateVal) dateQuery.$lte = endDateVal;
  if (lastFetchedDate) dateQuery.$lt = new Date(lastFetchedDate);
  if (Object.keys(dateQuery).length) query.date = dateQuery;

  const attendance = await Attendance.find(query)
    .sort({ date: -1 })
    .limit(limit)
    .then((records) =>
      records.filter((record) => {
        const day = new Date(record.date).getDay();
        return day !== 0 && day !== 6;
      })
    );

  if (!attendance || attendance.length === 0) {
    throw new CustomError("No attendance records found", 404);
  }
  const summaryQuery: any = { employeeId: objectId };
  if (startDate) summaryQuery.date = { $gte: startDate };
  if (endDateVal)
    summaryQuery.date = { ...(summaryQuery.date || {}), $lte: endDateVal };

  const aggregate = await Attendance.aggregate([
    { $match: summaryQuery },
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: "$date" },
      },
    },
    {
      $match: {
        dayOfWeek: { $nin: [1, 7] },
      },
    },
    {
      $group: {
        _id: null,
        totalDays: { $sum: 1 },
        presentDays: {
          $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
        },
        lateDays: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
        halfDays: { $sum: { $cond: [{ $eq: ["$status", "Half Day"] }, 1, 0] } },
        absentDays: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
        onLeaveDays: {
          $sum: { $cond: [{ $eq: ["$status", "On Leave"] }, 1, 0] },
        },
        avgHours: { $avg: "$totalHours" },
      },
    },
  ]);

  const summary = aggregate.length
    ? {
        totalDays: aggregate[0].totalDays || 0,
        presentDays: aggregate[0].presentDays || 0,
        lateDays: aggregate[0].lateDays || 0,
        halfDays: aggregate[0].halfDays || 0,
        absentDays: aggregate[0].absentDays || 0,
        onLeaveDays: aggregate[0].onLeaveDays || 0,
        avgHours: parseFloat((aggregate[0].avgHours || 0).toFixed(2)),
      }
    : {
        totalDays: 0,
        presentDays: 0,
        lateDays: 0,
        halfDays: 0,
        absentDays: 0,
        onLeaveDays: 0,
        avgHours: 0,
      };
  return {
    attendance,
    summary,
    lastFetchedDate:
      attendance.length > 0 ? attendance[attendance.length - 1].date : null,
    hasMore: attendance.length === limit,
    appliedFilter: filter || "custom",
  };
};

//get today attendance all employees
export const getTodayAttendanceAllEmployees = async (
  search: string = "",
  limit: number = 10,
  page: number = 1
) => {
  const skip = (page - 1) * limit;
  const today = getTodayDate();

  const attendance = await Attendance.aggregate([
    {
      $match: {
        $or: [
          { date: today },
          {
            date: {
              $gte: new Date(`${today}T00:00:00.000Z`),
              $lte: new Date(`${today}T23:59:59.999Z`),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
    {
      $match: search
        ? {
            $or: [
              { "employee.name": { $regex: search, $options: "i" } },
              { "employee.designation": { $regex: search, $options: "i" } },
              { "employee.employeeID": { $regex: search, $options: "i" } },
            ],
          }
        : {},
    },
    {
      $project: {
        _id: 1,
        date: 1,
        status: 1,
        totalHours: 1,
        checkIn: 1,
        checkOut: 1,
        "employee._id": 1,
        "employee.name": 1,
        "employee.email": 1,
        "employee.designation": 1,
        "employee.employeeID": 1,
      },
    },
    { $sort: { "employee.name": 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const aggregate = await Attendance.aggregate([
    {
      $match: {
        $or: [
          { date: today },
          {
            date: {
              $gte: new Date(`${today}T00:00:00.000Z`),
              $lte: new Date(`${today}T23:59:59.999Z`),
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        totalEmployees: { $sum: 1 },
        presentDays: {
          $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
        },
        lateDays: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
        halfDays: { $sum: { $cond: [{ $eq: ["$status", "Half Day"] }, 1, 0] } },
        absentDays: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
        onLeaveDays: {
          $sum: { $cond: [{ $eq: ["$status", "On Leave"] }, 1, 0] },
        },
        avgHours: { $avg: "$totalHours" },
      },
    },
  ]);

  const summary = aggregate.length
    ? {
        totalEmployees: aggregate[0].totalEmployees,
        presentDays: aggregate[0].presentDays,
        lateDays: aggregate[0].lateDays,
        halfDays: aggregate[0].halfDays,
        absentDays: aggregate[0].absentDays,
        onLeaveDays: aggregate[0].onLeaveDays,
        avgHours: parseFloat((aggregate[0].avgHours || 0).toFixed(2)),
      }
    : {
        totalEmployees: 0,
        presentDays: 0,
        lateDays: 0,
        halfDays: 0,
        absentDays: 0,
        onLeaveDays: 0,
        avgHours: 0,
      };

  const totalCount = await Attendance.aggregate([
    {
      $match: {
        $or: [
          { date: today },
          {
            date: {
              $gte: new Date(`${today}T00:00:00.000Z`),
              $lte: new Date(`${today}T23:59:59.999Z`),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
    {
      $match: search
        ? {
            $or: [
              { "employee.name": { $regex: search, $options: "i" } },
              { "employee.designation": { $regex: search, $options: "i" } },
              { "employee.employeeID": { $regex: search, $options: "i" } },
            ],
          }
        : {},
    },
    { $count: "total" },
  ]);

  const total = totalCount[0]?.total || 0;

  return {
    attendance,
    summary,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

//edit attendance
export const editAttendanceDetails = async (
  attendanceId: string,
  details: IAttendance
) => {
  const existing = await Attendance.findById(attendanceId);
  if (!existing) throw new CustomError("Attendance details not found", 400);

  let checkIn = existing.checkIn;
  let checkOut = existing.checkOut;
  let totalHours = existing.totalHours;

  if (details.status === "Absent" || details.status === "On Leave") {
    checkIn = null;
    checkOut = null;
    totalHours = 0;
  } else {
    if (details.checkIn) checkIn = new Date(details.checkIn);
    if (details.checkOut) checkOut = new Date(details.checkOut);

    if (checkIn && checkOut) {
      const totalMinutes =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60);

      totalHours = Number((totalMinutes / 60).toFixed(2));
    }
  }

  existing.checkIn = checkIn;
  existing.checkOut = checkOut;
  existing.status = details.status;
  existing.totalHours = totalHours;

  await existing.save();
  return existing;
};

// last fivedays summary
export const getLastFiveDaysAttendanceSummary = async () => {
  const today = new Date();

  const todayStr = today.toISOString().split("T")[0];
  const todayStart = new Date(`${todayStr}T00:00:00.000Z`);

  const searchStart = new Date(todayStart);
  searchStart.setDate(searchStart.getDate() - 10);

  const result = await Attendance.aggregate([
    {
      $addFields: {
        dayStr: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "UTC",
          },
        },
      },
    },
    {
      $match: {
        dayStr: {
          $gte: searchStart.toISOString().split("T")[0],
          $lte: todayStr,
        },
      },
    },
    {
      $group: {
        _id: "$dayStr",
        present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
        late: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
        halfday: { $sum: { $cond: [{ $eq: ["$status", "Half Day"] }, 1, 0] } },
        leave: { $sum: { $cond: [{ $eq: ["$status", "On Leave"] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  const formatted: any[] = [];
  let count = 0;
  let cursor = new Date(todayStart);

  while (count < 5) {
    const day = cursor.getDay();

    if (day !== 0 && day !== 6) {
      const key = cursor.toISOString().split("T")[0];
      const found = result.find((r) => r._id === key);

      formatted.push({
        day: cursor.toLocaleDateString("en-US", { weekday: "short" }),
        present: found?.present ?? 0,
        late: found?.late ?? 0,
        halfday: found?.halfday ?? 0,
        leave: found?.leave ?? 0,
        absent: found?.absent ?? 0,
      });

      count++;
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  return formatted.reverse();
};
