import mongoose from "mongoose";
import { ISubmittedTasks } from "../../interfaces/employee/employee";

interface ISubmittedTasksDocument extends ISubmittedTasks, Document {}

const submitedTaskSchema = new mongoose.Schema<ISubmittedTasksDocument>(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeTasks",
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    attachedFiles: {
      type: [
        {
          url: String,
          originalName: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const SubmittedTasks = mongoose.model<ISubmittedTasksDocument>(
  "SubmittedTasks",
  submitedTaskSchema
);
export default SubmittedTasks;
