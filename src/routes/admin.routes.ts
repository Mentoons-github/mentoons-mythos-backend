import express from "express";
import { employeeLogin } from "../controllers/employee/auth";
import userAuth from "../middlewares/authMiddleware";
import {
  addEmployee,
  addTaskToEmployee,
  deleteTask,
  editEmployee,
  editTaskDetails,
  getAllEmployees,
  getAllTasks,
  getEmployeeJobDistributions,
  getSingleEmployee,
  getSingleTaskDetails,
  handleTaskExtension,
} from "../controllers/admin/adminEmployeeController";
import {
  editAttendanceDetails,
  getEmployeeAttendance,
  getLastFiveDaysAttendanceSummary,
  getTodayAttendace,
  getTodayAttendanceAllEmployees,
} from "../controllers/employee/attendanceController";
import {
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../controllers/employee/employeeLeaveController";
import { taskStatusSummary } from "../controllers/employee/employeeController";

const router = express.Router();

router.get("/employee/all", userAuth, getAllEmployees);
router.get("/employee/single/:employeeId", userAuth, getSingleEmployee);
router.post("/employee/add", userAuth, addEmployee);
router.put("/employee/update/:employeeId", userAuth, editEmployee);
router.post("/employee/task/assign/:employeeId", userAuth, addTaskToEmployee);
router.get("/employee/task", userAuth, getAllTasks);
router.get("/employee/task/:taskId", userAuth, getSingleTaskDetails);
router.put("/employee/task/update/:taskId", userAuth, editTaskDetails);
router.delete("/employee/task/delete/:taskId", userAuth, deleteTask);
router.put("/employee/task/extension/update", userAuth, handleTaskExtension);
router.get("/employee/attendance", userAuth, getTodayAttendanceAllEmployees);
router.get(
  "/employee/attendance/today/:employeeId",
  userAuth,
  getTodayAttendace
);

router.get("/employee/attendance/:employeeId", userAuth, getEmployeeAttendance);
router.put(
  "/employee/attendance/edit/:attendanceId",
  userAuth,
  editAttendanceDetails
);
router.get("/employee/leave/requests", userAuth, getAllLeaveRequests);
router.put(
  "/employee/leave/update-status/:requestId",
  userAuth,
  updateLeaveStatus
);
router.get(
  "/employee/job/distributions",
  userAuth,
  getEmployeeJobDistributions
);
router.get(
  "/employee/attendance/get/lastfive",
  userAuth,
  getLastFiveDaysAttendanceSummary
);
router.get("/employee/task/status/summary", userAuth, taskStatusSummary);
export default router;
