import catchAsync from "../../utils/cathAsync";
import * as AdminEmployeeServices from "../../services/admin/adminEmployeeServices";
import {
  EmployeeFilterOptions,
  EmployeeTaskFilterOptions,
} from "../../interfaces/filterOptions";

//get all employees
export const getAllEmployees = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 0;
  const page = parseInt(req.query.page as string) || 1;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const filters: EmployeeFilterOptions = {
    designation: req.query.designation,
    jobType: req.query.jobType,
    department: req.query.department,
    status: req.query.status,
  };
  (Object.keys(filters) as (keyof EmployeeFilterOptions)[]).forEach((key) => {
    const value = filters[key];
    if (Array.isArray(value)) return;
    if (value && typeof value === "string" && value.includes(",")) {
      filters[key] = value.split(",") as any;
    }
  });

  const employees = await AdminEmployeeServices.getAllEmployees(
    limit,
    page,
    sort,
    search,
    filters
  );
  res.status(200).json({ message: "Fetched all employees", ...employees });
});

//get single employee
export const getSingleEmployee = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const employee = await AdminEmployeeServices.getSingleEmployee(employeeId);
  res
    .status(200)
    .json({ message: "Successfully fetched employee details", employee });
});

//add employee
export const addEmployee = catchAsync(async (req, res) => {
  const employee = await AdminEmployeeServices.addEmployee(req.body);
  res
    .status(200)
    .json({ message: "Successfully added new employer", employee });
});

//updated employee
export const editEmployee = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const updatedEmployee = await AdminEmployeeServices.editEmployee(
    req.body,
    employeeId
  );
  res.status(200).json({
    message: "Employee details successfully updated",
    updatedEmployee,
  });
});

//add task to employee
export const addTaskToEmployee = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const task = await AdminEmployeeServices.addTaskToEmployee(
    employeeId,
    req.body
  );
  res.status(201).json({ message: "New task assigned to the employee", task });
});

//get all tasks
export const getAllTasks = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 0;
  const page = parseInt(req.query.page as string) || 1;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const filters: EmployeeTaskFilterOptions = {
    designation: req.query.designation,
    department: req.query.department,
    status: req.query.status,
    priority: req.query.priority,
  };
  (Object.keys(filters) as (keyof EmployeeTaskFilterOptions)[]).forEach(
    (key) => {
      const value = filters[key];
      if (Array.isArray(value)) return;
      if (value && typeof value === "string" && value.includes(",")) {
        filters[key] = value.split(",") as any;
      }
    }
  );

  const tasks = await AdminEmployeeServices.getAllTasks(
    limit,
    page,
    sort,
    search,
    filters
  );
  res.status(200).json({ message: "Fetched all employees", ...tasks });
});

//get single task
export const getSingleTaskDetails = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const task = await AdminEmployeeServices.getSingleTaskDetails(taskId);
  res.status(200).json({ message: "Single task fetched", task });
});

// edit task
export const editTaskDetails = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const updatedTask = await AdminEmployeeServices.editTaskDetails(
    taskId,
    req.body
  );
  res.status(200).json({ message: "Task details updated", updatedTask });
});

// delete task
export const deleteTask = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const deleted = await AdminEmployeeServices.deleteTask(taskId);
  res.status(200).json({ message: "Task successfully deleted", deleted });
});

//handle extension
export const handleTaskExtension = catchAsync(async (req, res) => {
  const task = await AdminEmployeeServices.handleTaskExtension(req.body);
  res.status(200).json({ message: `Task extension ${req.body.status}`, task });
});

// get employee job distributions
export const getEmployeeJobDistributions = catchAsync(async (req, res) => {
  const details = await AdminEmployeeServices.getEmployeeJobDistributions();
  res
    .status(200)
    .json({ message: "Successfullt fetched job distribution", ...details });
});
