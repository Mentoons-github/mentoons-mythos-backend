import mongoose from "mongoose";

export interface IAttendance {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: "Present" | "Absent" | "On Leave" | "Half Day" | "Late";
  totalHours: number;
}

export interface ILeave {
  employeeId: mongoose.Types.ObjectId;
  leaveType: "Emergency" | "Casual" | "Medical";
  fromDate: Date;
  toDate: Date;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectReason: string;
  totalDays: number;
}
