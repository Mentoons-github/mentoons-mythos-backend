import mongoose from "mongoose";

export interface EmployeeLogin {
  employeeID: string;
  password: string;
}

export interface IEmployee {
  name: string;
  email: string;
  employeeID: string;
  gender: string;
  password: string;
  assignedBy: string;
  designation: string;
  jobType: string;
  department: string;
  role: "employee" | "admin";
  salary: number;
  profileImage: string;
}

export interface IEmployeeDocument extends IEmployee, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IEmployeeTasks {
  title: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  priority: "Low" | "Medium" | "High" | "Urgent";
  startDate: Date;
  dueDate: Date;
  status:
    | "Pending"
    | "In Progress"
    | "Completed"
    | "Overdue"
    | "Completed Late"
    | "Extension Requested" 
    | "Removed"
  attachments: string[];
  submission: mongoose.Types.ObjectId;
  extensionRequest: IExtensionRequest;
}

export interface ISubmittedTasks {
  taskId: mongoose.Types.ObjectId;
  details: string;
  attachedFiles: [{ url: string; originalName: string }];
}

export interface IExtensionRequest {
  requestedDate: Date;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  requestedAt: Date;
}
