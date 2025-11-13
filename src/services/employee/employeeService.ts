// import Employee from "../../models/employee/employee";
// import CustomError from "../../utils/customError";

import mongoose from "mongoose";
import { IEmployee } from "../../interfaces/employee";
import {
  IExtensionRequest,
  ISubmittedTasks,
} from "../../interfaces/employee/employee";
import Employee from "../../models/employee/employee";
import EmployeeTasks from "../../models/employee/employeeTasks";
import SubmittedTasks from "../../models/employee/submittedTasks";
import CustomError from "../../utils/customError";
import Attendance from "../../models/employee/attendanceModel";

export const employeeExits = async (employeeID: string | number) => {
  try {
    const employee = await Employee.findOne({ employeeID });
    if (!employee) {
      throw new CustomError("No user found", 404);
    }
    return employee;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(error.message, 500);
    }
    throw new CustomError("Unexpected error", 500);
  }
};

//update employye profile
export const updateEmployeeProfile = async (
  details: IEmployee,
  employeeId: string
) => {
  const updated = await Employee.findByIdAndUpdate(
    employeeId,
    {
      name: details.name,
      profileImage: details.profileImage,
    },
    { new: true, runValidators: true }
  );
  if (!updated) throw new CustomError("Employee not found", 400);

  return updated;
};

// get employee tasks
export const getEmployeeTasks = async (
  employeeId: string,
  limit: number,
  filter?: string,
  lastDate?: string,
  search?: string
) => {
  if (!employeeId) throw new CustomError("Employee id required", 400);

  const query: any = { assignedTo: employeeId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { status: { $regex: search, $options: "i" } },
    ];
  }

  if (filter) {
    query.status = filter;
  }

  if (lastDate) {
    query.createdAt = { $lt: new Date(lastDate) };
  }

  const tasks = await EmployeeTasks.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);

  return tasks;
};

// update status
export const updateTaskStatus = async (
  taskId: string,
  { status }: { status: string }
) => {
  const updatedTask = await EmployeeTasks.findByIdAndUpdate(
    taskId,
    {
      status,
    },
    { new: true, runValidators: true }
  );
  return updatedTask;
};

//submit task
export const submitTask = async (details: ISubmittedTasks) => {
  const alreadyHave = await SubmittedTasks.findOne({ taskId: details.taskId });
  if (alreadyHave) throw new CustomError("Task already submitted", 400);
  const submittedTask = await SubmittedTasks.create({
    taskId: details.taskId,
    details: details.details,
    attachedFiles: details.attachedFiles,
  });
  await EmployeeTasks.findByIdAndUpdate(details.taskId, {
    submission: submittedTask._id,
    status: "Completed",
  });
  return submittedTask;
};

//view single submission by task
export const singleSubmission = async (taskId: string) => {
  if (!taskId) throw new CustomError("Task id not found", 400);
  const submittedDetails = await SubmittedTasks.findOne({ taskId });
  return submittedDetails;
};

//request for extension
export const requestExtension = async (
  taskId: string,
  data: IExtensionRequest
) => {
  const { reason, requestedDate } = data;
  const task = await EmployeeTasks.findById(taskId);
  if (!task) throw new CustomError("Task not found", 400);
  task.status = "Extension Requested";
  task.extensionRequest = {
    requestedDate,
    reason,
    status: "Pending",
    requestedAt: new Date(),
  };
  await task.save();
  return task;
};

//status summary
export const taskStatusSummary = async (
  filter: "week" | "month" | "all",
  userId?: string
) => {
  const allStatuses = [
    "Pending",
    "In Progress",
    "Completed",
    "Overdue",
    "Completed Late",
    "Extension Requested",
    "Removed",
  ];
  const match: any = {};
  if (userId) {
    match.assignedTo = new mongoose.Types.ObjectId(userId);
  }
  if (filter === "week") {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    match.createdAt = { $gte: startOfWeek };
  }

  if (filter === "month") {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    match.createdAt = { $gte: startOfMonth };
  }

  const result = await EmployeeTasks.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const summary = allStatuses.map((status) => {
    const found = result.find((r) => r._id === status);
    return {
      status,
      count: found ? found.count : 0,
    };
  });
  const totalCount = summary.reduce((acc, item) => acc + (item.count ?? 0), 0);

  return { summary, totalCount };
};

//task status summary a employee
export const taskStatusSummaryEmployee = async (
  employeeId: string,
  filter: "week" | "month" | "all" = "all"
) => {
  const allStatuses = [
    "Pending",
    "In Progress",
    "Completed",
    "Overdue",
    "Completed Late",
    "Extension Requested",
    "Removed",
  ];

  const match: any = {
    assignedTo: new mongoose.Types.ObjectId(employeeId),
  };

  const activeTasks = await EmployeeTasks.find({
    assignedTo: employeeId,
    status: { $in: ["Pending", "In Progress"] },
  });

  if (filter === "week") {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    match.createdAt = { $gte: startOfWeek };
  }

  if (filter === "month") {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    match.createdAt = { $gte: startOfMonth };
  }

  const result = await EmployeeTasks.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = allStatuses.map((status) => {
    const found = result.find((r) => r._id === status);
    return {
      status,
      count: found?.count ?? 0,
    };
  });
  const totalCount = summary.reduce((acc, item) => acc + item.count, 0);
  return { summary, totalCount, activeTasks };
};

//get employee performance
export const getEmployeePerformance = async (employeeId: string) => {
  const tasks = await EmployeeTasks.aggregate([
    { $match: { assignedTo: new mongoose.Types.ObjectId(employeeId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const stats = Object.fromEntries(tasks.map((t) => [t._id, t.count]));

  const Completed = stats["Completed"] || 0;
  const CompletedLate = stats["Completed Late"] || 0;
  const Pending = stats["Pending"] || 0;
  const InProgress = stats["In Progress"] || 0;
  const Overdue = stats["Overdue"] || 0;
  const Removed = stats["Removed"] || 0;

  const TotalTasks =
    Completed + CompletedLate +  Overdue + Removed;

  const TaskRawScore =
    Completed * 2 + CompletedLate * 1 - Overdue * 1 - Removed * 2;

  const MaxTaskPoints = TotalTasks * 2;
  const TaskPercentage =
    MaxTaskPoints > 0 ? (TaskRawScore / MaxTaskPoints) * 100 : 0;
  const TaskScore = (TaskPercentage / 100) * 50; // max 50 pts

  const attendance = await Attendance.aggregate([
    { $match: { employeeId: new mongoose.Types.ObjectId(employeeId) } },
    {
      $group: {
        _id: null,
        present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
        lateDays: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
        halfDays: { $sum: { $cond: [{ $eq: ["$status", "Half Day"] }, 1, 0] } },
        absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
      },
    },
  ]);

  const presentDays = attendance[0]?.present || 0;
  const lateDays = attendance[0]?.lateDays || 0;
  const halfDays = attendance[0]?.halfDays || 0;
  const absentDays = attendance[0]?.absent || 0;

  const WorkingDays = presentDays + lateDays + halfDays + absentDays;

  const AttendancePercentage =
    WorkingDays > 0
      ? ((presentDays * 1 +
          halfDays * 0.5 +
          lateDays * -0.5 +
          absentDays * -1) /
          WorkingDays) *
        100
      : 0;

  const AttendanceScore = (AttendancePercentage / 100) * 50;

  const FinalPercentage = Math.max(
    0,
    Math.min(100, Math.round(TaskPercentage * 0.5 + AttendancePercentage * 0.5))
  );

  const FinalRating = Number((FinalPercentage / 20).toFixed(1));

  let PerformanceLabel = "Poor";
  if (FinalRating >= 4.5) PerformanceLabel = "Excellent";
  else if (FinalRating >= 3.5) PerformanceLabel = "Good";
  else if (FinalRating >= 2.5) PerformanceLabel = "Average";
  else if (FinalRating >= 1.5) PerformanceLabel = "Needs Improvement";

  return {
    FinalPercentage,
    FinalRating,
    PerformanceLabel,
    TaskScore: Math.round(TaskScore),
    AttendanceScore: Math.round(AttendanceScore),
    TaskPercentage: Math.round(TaskPercentage),
    AttendancePercentage: Math.round(AttendancePercentage),
    stats: {
      Completed,
      CompletedLate,
      Pending,
      InProgress,
      Overdue,
      Removed,
    },
    attendance: {
      presentDays,
      lateDays,
      halfDays,
      absentDays,
    },
    maxScore: 100,
  };
};
