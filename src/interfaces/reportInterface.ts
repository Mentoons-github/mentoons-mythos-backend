import mongoose, { Document } from "mongoose";

export interface IReport extends Document {
  from: string;
  fromId?: string;
  userId: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
