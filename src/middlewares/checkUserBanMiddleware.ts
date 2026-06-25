import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

export const checkUserBan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const email = req.body.email;

    if (!email) return next();

    const user = await User.findOne({ email });

    if (!user) return next();

    if (user.isBlocked) {
      // Temporary Ban
      if (user.bannedUntil) {
        const now = new Date();

        if (now > user.bannedUntil) {
          user.isBlocked = false;
          user.bannedUntil = null;

          await user.save();
        } else {
          res.status(200).json({
            isBlocked: true,
            bannedUntil: user.bannedUntil,
          });
          return;
        }
      } else {
        // Permanent Ban
        res.status(200).json({
          isBlocked: true,
        });
        return;
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};
