import mongoose, { Schema } from "mongoose";
import { IEmployeeTasks } from "../../interfaces/employee/employee";

const employeeTaskSchema = new Schema<IEmployeeTasks>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    startDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
        "Overdue",
        "Completed Late",
        "Extension Requested",
        "Removed",
      ],
      default: "Pending",
    },
    attachments: {
      type: [String],
      default: [],
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubmittedTasks",
    },
    extensionRequest: {
      requestedDate: Date,
      reason: String,
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      requestedAt: Date,
    },
  },
  { timestamps: true }
);

const EmployeeTasks = mongoose.model<IEmployeeTasks>(
  "EmployeeTasks",
  employeeTaskSchema
);
export default EmployeeTasks;
