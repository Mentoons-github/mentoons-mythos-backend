import mongoose from "mongoose";

export interface RewardPoints {
  userId: mongoose.Types.ObjectId;
  action: string;
  points: number;
}
