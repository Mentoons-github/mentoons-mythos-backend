import cron from "node-cron";
import EmployeeTasks from "../models/employee/employeeTasks";

cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  await EmployeeTasks.updateMany(
    { dueDate: { $lt: now }, status: { $ne: "Completed" } },
    { $set: { status: "Overdue" } }
  );
  console.log("✅ Overdue tasks updated at midnight");
});
