import express from "express";
import { employeeLogin } from "../controllers/employee/auth";
import userAuth from "../middlewares/authMiddleware";
import {
  getEmployeePerformance,
  getEmployeeTasks,
  requestExtension,
  singleSubmission,
  submitTask,
  taskStatusSummaryEmployee,
  updateEmployeeProfile,
  updateTaskStatus,
} from "../controllers/employee/employeeController";
import {
  checkIn,
  checkOut,
  getEmployeeAttendance,
  getTodayAttendace,
} from "../controllers/employee/attendanceController";
import {
  applyLeave,
  getEmployeeLeaveRequests,
  getSingleLeaveRequest,
} from "../controllers/employee/employeeLeaveController";

const router = express.Router();

router.post("/login", employeeLogin);
router.put("/update/:employeeId", userAuth, updateEmployeeProfile);
router.get("/task", userAuth, getEmployeeTasks);
router.patch("/task/update-status/:taskId", userAuth, updateTaskStatus);
router.post("/task/submit/", userAuth, submitTask);
router.get("/task/submit/:taskId", userAuth, singleSubmission);
router.post("/task/extension/:taskId", userAuth, requestExtension);
router.post("/attendance/check-in", userAuth, checkIn);
router.patch("/attendance/check-out", userAuth, checkOut);
router.get("/attendance/today", userAuth, getTodayAttendace);
router.get("/attendance", userAuth, getEmployeeAttendance);
router.post("/leave/apply", userAuth, applyLeave);
router.get("/leave/requests", userAuth, getEmployeeLeaveRequests);
router.get("/leave/request/:requestId", userAuth, getSingleLeaveRequest);
router.get("/task/summary", userAuth, taskStatusSummaryEmployee);
router.get("/performance", userAuth, getEmployeePerformance);

export default router;
