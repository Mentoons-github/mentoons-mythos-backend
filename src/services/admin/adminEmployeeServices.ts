import { IEmployee } from "../../interfaces/employee";
import { IEmployeeTasks } from "../../interfaces/employee/employee";
import {
  EmployeeFilterOptions,
  EmployeeTaskFilterOptions,
} from "../../interfaces/filterOptions";
import Employee from "../../models/employee/employee";
import EmployeeTasks from "../../models/employee/employeeTasks";
import Notification from "../../models/notificationModel";
import User from "../../models/userModel";
import { passwordHash } from "../../utils/bcrypt";
import CustomError from "../../utils/customError";
import {
  generateEmployeeId,
  generateEmployeePassword,
  sendPasswordToMail,
} from "../../utils/employeeUtil";

//get all employees
export const getAllEmployees = async (
  limit: number,
  page: number,
  sort: string,
  search?: string,
  filters: EmployeeFilterOptions = {}
) => {
  const skip = (page - 1) * limit;
  const query: any = { role: "employee" };

  const sortOrder = sort === "newest" ? -1 : 1;
  const { designation, jobType, department, status, experience } = filters;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { employeeID: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
    ];
  }

  if (designation) {
    query.designation = Array.isArray(designation)
      ? { $in: designation }
      : designation;
  }

  if (jobType) {
    query.jobType = Array.isArray(jobType) ? { $in: jobType } : jobType;
  }

  if (department) {
    query.department = Array.isArray(department)
      ? { $in: department }
      : department;
  }

  if (status) {
    query.status = status;
  }

  if (experience) {
    query.experience = experience;
  }

  const employees = await Employee.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortOrder });

  const total = await Employee.countDocuments(query);

  return {
    employees,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// get single employee
export const getSingleEmployee = async (employeeId: string) => {
  if (!employeeId) throw new CustomError("Employee id is required", 400);
  const employee = await Employee.findById(employeeId);
  return employee;
};

//add employee
export const addEmployee = async ({ data }: { data: IEmployee }) => {
  const firstPassword = generateEmployeePassword();
  const hashedPassword = await passwordHash(firstPassword);
  const employeeID = await generateEmployeeId(data.designation);

  console.log(employeeID, "idddddddd");
  console.log(firstPassword, "password...");

  const employeeExist = await Employee.findOne({ email: data.email });
  if (employeeExist) throw new CustomError("Employee already Exist", 400);

  const employee = await Employee.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    gender: data.gender,
    employeeID,
    designation: data.designation,
    department: data.department,
    jobType: data.jobType,
    salary: data.salary,
  });

  await sendPasswordToMail({
    to: data.email,
    password: firstPassword,
    name: data.name,
  });

  return employee;
};

//edit employee
export const editEmployee = async (data: IEmployee, employeeId: string) => {
  console.log(data, "dataaaaa");
  const updated = await Employee.findByIdAndUpdate(
    employeeId,
    {
      name: data.name,
      email: data.email,
      gender: data.gender,
      designation: data.designation,
      department: data.department,
      jobType: data.jobType,
      salary: data.salary,
    },
    { new: true, runValidators: true }
  );
  if (!updated) throw new CustomError("Employee not found", 400);
  return updated;
};

//add tasks to employee
export const addTaskToEmployee = async (
  employeeId: string,
  task: IEmployeeTasks
) => {
  const {
    title,
    description,
    assignedTo,
    priority,
    startDate,
    dueDate,
    status,
    attachments,
  } = task;
  const newTask = await EmployeeTasks.create({
    title,
    description,
    assignedTo,
    priority,
    startDate,
    dueDate,
    status,
    attachments,
  });
  const populatedTask = await newTask.populate("assignedTo");
  const result = {
    ...populatedTask.toObject(),
    employee: populatedTask.assignedTo,
  };
  return result;
};

//get all tasks
export const getAllTasks = async (
  limit: number,
  page: number,
  sort: string,
  search?: string,
  filters: EmployeeTaskFilterOptions = {}
) => {
  if (limit <= 0) limit = 10;
  if (page <= 0) page = 1;

  const skip = (page - 1) * limit;
  const sortOrder = sort === "newest" ? -1 : 1;

  const { status, priority, designation, department } = filters;

  const aggregatePipeline: any[] = [
    {
      $lookup: {
        from: "employees",
        localField: "assignedTo",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
  ];

  const matchStage: any = {};
  if (status)
    matchStage.status = Array.isArray(status) ? { $in: status } : status;
  if (priority)
    matchStage.priority = Array.isArray(priority)
      ? { $in: priority }
      : priority;
  if (designation)
    matchStage["employee.designation"] = Array.isArray(designation)
      ? { $in: designation }
      : designation;
  if (department)
    matchStage["employee.department"] = Array.isArray(department)
      ? { $in: department }
      : department;

  if (Object.keys(matchStage).length > 0) {
    aggregatePipeline.push({ $match: matchStage });
  }

  if (search) {
    aggregatePipeline.push({
      $match: {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { "employee.department": { $regex: search, $options: "i" } },
          { "employee.name": { $regex: search, $options: "i" } },
          { "employee.email": { $regex: search, $options: "i" } },
          { "employee.employeeID": { $regex: search, $options: "i" } },
          { "employee.designation": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  aggregatePipeline.push({ $sort: { createdAt: sortOrder } });
  aggregatePipeline.push({ $skip: skip });
  aggregatePipeline.push({ $limit: limit });

  const tasks = await EmployeeTasks.aggregate(aggregatePipeline);

  const countPipeline = aggregatePipeline.filter(
    (stage) => !stage.$skip && !stage.$limit && !stage.$sort
  );
  const totalCountResult = await EmployeeTasks.aggregate([
    ...countPipeline,
    { $count: "count" },
  ]);
  const total = totalCountResult[0]?.count || 0;

  return {
    tasks,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  };
};

// getSingleTask
export const getSingleTaskDetails = async (taskId: string) => {
  const task = await EmployeeTasks.findById(taskId)
    .populate("assignedTo")
    .lean();
  if (!task) throw new CustomError("Invalid task id", 400);
  const { assignedTo, ...rest } = task;
  return { ...rest, employee: assignedTo };
};

//edit task details
export const editTaskDetails = async (
  taskId: string,
  details: IEmployeeTasks
) => {
  const {
    assignedTo,
    attachments,
    description,
    dueDate,
    priority,
    startDate,
    status,
    title,
  } = details;
  const updated = await EmployeeTasks.findByIdAndUpdate(
    taskId,
    {
      title,
      description,
      assignedTo,
      priority,
      status,
      startDate,
      dueDate,
      attachments,
    },
    { new: true, runValidators: true }
  );
  if (!updated) throw new CustomError("Task not found", 400);
  const populatedTask = await updated.populate("assignedTo");
  const result = {
    ...populatedTask.toObject(),
    employee: populatedTask.assignedTo,
  };
  return result;
};

//delete task
export const deleteTask = async (taskId: string) => {
  const deleted = await EmployeeTasks.findByIdAndDelete(taskId);
  if (!deleted) throw new CustomError("Task not found", 400);
};

//handelExtension
export const handleTaskExtension = async (details: {
  taskId: string;
  status: "Pending" | "Approved" | "Rejected";
  dueDate: Date;
}) => {
  console.log(details, "details");
  const updatedTask = await EmployeeTasks.findById(details.taskId);
  if (!updatedTask) {
    throw new Error("Task not found");
  }

  updatedTask.extensionRequest = {
    ...updatedTask.extensionRequest,
    status: details.status,
  };

  if (details.status === "Rejected") {
    updatedTask.status = "Removed";
  } else {
    updatedTask.status = "Pending";
    updatedTask.dueDate = details.dueDate;
  }

  // Save the updated task
  await updatedTask.save();

  const populatedTask = await updatedTask.populate("assignedTo");
  const result = {
    ...populatedTask.toObject(),
    employee: populatedTask.assignedTo,
  };

  return result;
};

// get employee job distributions
export const getEmployeeJobDistributions = async () => {
  const result = await Employee.aggregate([
    {
      $group: {
        _id: "$jobType",
        count: { $sum: 1 },
      },
    },
  ]);

  const formatted = {
    fullTime: 0,
    freelance: 0,
    intern: 0,
  };
  const totalEmployee = result.reduce(
    (acc, item) => acc + (item.count ?? 0),
    0
  );
  result.forEach((item) => {
    if (item._id === "Full Time") formatted.fullTime = item.count;
    if (item._id === "Freelance") formatted.freelance = item.count;
    if (item._id === "Intern") formatted.intern = item.count;
  });

  return { formatted, totalEmployee };
};
