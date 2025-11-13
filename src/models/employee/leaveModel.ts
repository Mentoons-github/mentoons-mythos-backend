import mongoose from "mongoose";
import { ILeave } from "../../interfaces/employee/attendance & leave";

interface ILeaveDocument extends ILeave, Document {}

const leaveSchema = new mongoose.Schema<ILeaveDocument>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["Emergency", "Casual", "Medical"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
      set: (d: Date) => new Date(d.setHours(0, 0, 0, 0)),
    },
    toDate: {
      type: Date,
      required: true,
      set: (d: Date) => new Date(d.setHours(0, 0, 0, 0)),
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectReason:{
      type:String,
      required:false
    },
    totalDays: {
      type: Number,
      default: function (this: any) {
        return Math.ceil(
          (this.toDate.getTime() - this.fromDate.getTime()) /
            (1000 * 60 * 60 * 24) +
            1
        );
      },
    },
  },
  { timestamps: true }
);

const Leave = mongoose.model<ILeaveDocument>("Leave", leaveSchema);
export default Leave;
