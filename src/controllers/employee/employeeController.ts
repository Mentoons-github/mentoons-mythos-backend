// import catchAsync from "../../utils/cathAsync";
import * as EmployeeServices from "../../services/employee/employeeService";

import catchAsync from "../../utils/cathAsync";

// export const getAllEmployees = catchAsync(async (req, res) => {
//   const limit = parseInt(req.query.limit as string) || 0;
//   const page = parseInt(req.query.page as string) || 1;
//   const sort = (req.query.sort as "newest" | "oldest") || "newest";
//   const search = (req.query.search as string) || "";
//   const employees = await EmployeeServices.getAllEmployees(
//     limit,
//     page,
//     sort,
//     search
//   );
//   res.status(200).json({ message: "Fetched all employees", ...employees });
// });

//update employee profile
export const updateEmployeeProfile = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const updatedProfile = await EmployeeServices.updateEmployeeProfile(
    req.body,
    employeeId
  );

  res.status(200).json({ message: "Employee profile updated", updatedProfile });
});

// get employee tasks
export const getEmployeeTasks = catchAsync(async (req, res) => {
  const employee = req.user;
  const limit = parseInt(req.query.limit as string) || 12;
  const filter = (req.query.filter as string) || "";
  const lastDate = (req.query.lastDate as string) || "";
  const search = (req.query.search as string) || "";
  if (employee.role !== "employee") {
    return res.status(400).json({ message: "You are not an employee" });
  }
  const tasks = await EmployeeServices.getEmployeeTasks(
    employee._id,
    limit,
    filter,
    lastDate,
    search
  );
  res.status(200).json({ message: "Fetched employee tasks", tasks });
});

//update task status
export const updateTaskStatus = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const updatedTask = await EmployeeServices.updateTaskStatus(taskId, req.body);
  res.status(200).json({ message: "Task status updated", updatedTask });
});

//submitted task
export const submitTask = catchAsync(async (req, res) => {
  const submittedTask = await EmployeeServices.submitTask(req.body);
  res
    .status(200)
    .json({ message: "Task successfully Submitted", submittedTask });
});

// get single submission
export const singleSubmission = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const submission = await EmployeeServices.singleSubmission(taskId);
  res
    .status(200)
    .json({ message: "Successfully fetched single submission", submission });
});

//request Extension
export const requestExtension = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const task = await EmployeeServices.requestExtension(taskId, req.body);
  res.status(200).json({ message: "Extension request submitted", task });
});

// status sammary
export const taskStatusSummary = catchAsync(async (req, res) => {
  let userId: string | undefined;

  if (req.query.from) {
    userId = req.user._id;
  }
  const filter = (req.query.filter as "week" | "month" | "all") || "all";
  const summary = await EmployeeServices.taskStatusSummary(filter, userId);
  res
    .status(200)
    .json({ message: "Successfully fetched task status summary", ...summary });
});

//employee status summary
export const taskStatusSummaryEmployee = catchAsync(async (req, res) => {
  const employeeId = req.user._id;
  const filter = (req.query.filter as "week" | "month" | "all") || "week";
  const summary = await EmployeeServices.taskStatusSummaryEmployee(
    employeeId,
    filter
  );
  res
    .status(200)
    .json({ message: "Successfully fetched task status summary", ...summary });
});

//get employeee performance
export const getEmployeePerformance = catchAsync(async (req, res) => {
  const employeeId = req.user._id;
  const details = await EmployeeServices.getEmployeePerformance(employeeId);
  res.status(200).json({ message: "Employee performance fetched", ...details });
});
