import mongoose, { Document } from "mongoose";

export interface IReport extends Document {
  targetType: string;
  targetId?: string;
  reportedUser: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  reason: string;
  status?: "pending" | "reviewed" | "resolved" | "rejected";
  actionTaken?:
    | "none"
    | "deleted"
    | "hidden"
    | "warning_sent"
    | "user_banned"
    | "ignore";
}

export interface IBlock extends Document {
  blockedUser: mongoose.Types.ObjectId;
  blockedBy: mongoose.Types.ObjectId;
  reason: string;
}
