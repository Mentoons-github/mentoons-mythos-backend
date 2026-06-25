import mongoose, { Schema } from "mongoose";
import { IReport } from "../interfaces/reportInterface";

const reportSchema: Schema = new Schema<IReport>(
  {
    targetType: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "rejected"],
      default: "pending",
    },
    actionTaken: {
      type: String,
      enum: ["none", "deleted", "hidden", "warning_sent", "user_banned"],
      default: "none",
    },
  },
  { timestamps: true },
);

const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
