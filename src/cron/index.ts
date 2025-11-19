import cron from "node-cron";
import Employee from "../models/employee/employee";
import Attendance from "../models/employee/attendanceModel";
import EmployeeTasks from "../models/employee/employeeTasks";
import DBConnection from "../config/db";

DBConnection();

const getTodayDate = () => new Date().toISOString().split("T")[0];

cron.schedule(
  "00 7 * * *",
  async () => {
    const today = getTodayDate();
    const employees = await Employee.find();

    for (const emp of employees) {
      const existing = await Attendance.findOne({
        employeeId: emp._id,
        date: today,
      });

      if (!existing) {
        await Attendance.create({
          employeeId: emp._id,
          date: today,
          status: "Absent",
        });
      }
    }

    console.log("✔ Auto Absent Marked:", new Date());
  },
  { timezone: "Asia/Kolkata" }
);

cron.schedule(
  "0 0 * * *",
  async () => {
    const now = new Date();

    await EmployeeTasks.updateMany(
      { dueDate: { $lt: now }, status: { $ne: "Completed" } },
      { $set: { status: "Overdue" } }
    );

    console.log("✔ Overdue Tasks Updated:", new Date());
  },
  { timezone: "Asia/Kolkata" }
);
