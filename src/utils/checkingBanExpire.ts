import cron from "node-cron";
import User from "../models/userModel";
import { BanExpiredMail } from "./blogActionMail";

cron.schedule("0 * * * *", async () => {
  console.log("🚀 Ban expiry cron initialized");
  try {
    const now = new Date();

    const expiredUsers = await User.find({
      isBlocked: true,
      bannedUntil: { $lte: now, $ne: null },
    });

    for (const user of expiredUsers) {
      user.isBlocked = false;
      user.bannedUntil = null;

      await user.save();

      await BanExpiredMail({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });

      console.log(`Ban expired for ${user.email}`);
    }
  } catch (error) {
    console.error("Ban expiry cron error:", error);
  }
});
