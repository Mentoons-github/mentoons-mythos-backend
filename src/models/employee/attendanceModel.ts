import mongoose from "mongoose";
import { IAttendance } from "../../interfaces/employee/attendance & leave";

interface IAttendanceDocument extends IAttendance, Document {}
const attendanceSchema = new mongoose.Schema<IAttendanceDocument>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      required: function () {
        return (
          this.status === "Present" ||
          this.status === "Late" ||
          this.status === "Half Day"
        );
      },
      default: null,
    },
    checkOut: {
      type: Date,
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "On Leave", "Half Day", "Late"],
      default: "Absent",
    },
    totalHours: {
      type: Number,
      default:0
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model<IAttendanceDocument>(
  "Attendance",
  attendanceSchema
);
export default Attendance;
