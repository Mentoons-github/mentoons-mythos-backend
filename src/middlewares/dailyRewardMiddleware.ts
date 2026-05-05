import { Request, Response, NextFunction } from "express";
import { addRewardPoints } from "../services/RewardPointServices";
import User from "../models/userModel";
import { IUser } from "../interfaces/userInterface";

const DAILY_POINTS = 5;

export const dailyVisitReward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as IUser)?._id;
    if (!userId) return next();

    const user = await User.findById(userId);
    if (!user) return next();

    const today = new Date().toDateString();
    const last = user.lastDailyReward
      ? new Date(user.lastDailyReward).toDateString()
      : null;

    if (today !== last) {
      const reward = await addRewardPoints({
        userId,
        action: "DAILY_VISIT",
        points: DAILY_POINTS,
      });

      user.lastDailyReward = new Date();
      await user.save();

      res.locals.reward = reward.points;
    }

    next();
  } catch (err) {
    next(err);
  }
};
