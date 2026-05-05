import mongoose from "mongoose";
import RewardPoints from "../models/rewardPointModel";
import User from "../models/userModel";

export const addRewardPoints = async ({
  userId,
  action,
  points,
  postId,
}: {
  userId: mongoose.Types.ObjectId | string;
  action: string;
  points: number;
  postId?: string;
}) => {
  console.log(userId, action, points);
  const finalPoints =
    action === "UNLIKE_BLOG" || action === "DELETE_BLOG" || action === "DELETE_COMMENT"
      ? -Math.abs(points)
      : Math.abs(points);
  await RewardPoints.create({
    userId: userId,
    action,
    points: finalPoints,
  });

  const user = await User.findByIdAndUpdate(userId, {
    $inc: { rewardPoints: finalPoints },
  });

  return {
    points: finalPoints,
    action,
    postId,
  };
};
