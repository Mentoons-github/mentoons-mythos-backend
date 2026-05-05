import mongoose from "mongoose";
import { RewardPoints } from "../interfaces/rewarPointInterface";

interface IRewardPointsDocument extends RewardPoints, Document {}

const rewardSchema = new mongoose.Schema<IRewardPointsDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    points: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const RewardPoints = mongoose.model<IRewardPointsDocument>(
  "RewardPoints",
  rewardSchema
);
export default RewardPoints;
