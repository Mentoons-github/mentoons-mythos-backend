import cron from "node-cron";
import Employee from "../models/employee/employee";
import Attendance from "../models/employee/attendanceModel";

// Utility to get today's date (YYYY-MM-DD)
// const getTodayDate = () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return today;
// };
const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const autoMarkAbsent = async () => {
  try {
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

    console.log("✅ Attendance auto-marked as Absent for missing employees");
  } catch (error) {
    console.error("❌ Error marking absents:", error);
  }
};

// Runs every day at 9:30 AM
cron.schedule("0 7 * * *", async () => {
  await autoMarkAbsent();
});
