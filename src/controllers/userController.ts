import User from "../models/userModel";
import {
  getAstroAccessToken,
  getSunAndMoonSign,
} from "../services/astrologyService";
import * as userService from "../services/userService";
import catchAsync from "../utils/cathAsync";

export const fetchUser = catchAsync(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

export const fetchAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 0;
  const sort = (req.query.sort as "newest" | "oldest") || "newest";
  const search = (req.query.search as string) || "";
  const filterBy = (req.query.filterBy as string) || "";
  const filterValue = (req.query.filterValue as string) || "";

  const users = await userService.fetchAllUsers(
    page,
    limit,
    sort,
    search,
    filterBy,
    filterValue
  );
  res.status(200).json({
    success: true,
    ...users,
  });
});

//fetch user count
export const fetchUserCount = catchAsync(async (req, res) => {
  const count = await userService.fetchUserCount();
  res.status(200).json({ message: "count fetched", count });
});

//block user
export const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;
  const updatedUser = await userService.blockUser(userId, currentUserId);

  res.status(200).json({
    success: true,
    message: updatedUser?.isBlocked
      ? "User has been blocked"
      : "User has been unblocked",
    user: updatedUser,
  });
});

//update user
export const updateUser = catchAsync(async (req, res) => {
  const { data: details } = req.body;
  const userId = req.user._id;

  let user = await userService.userExist(userId);

  const oldDob = user.dateOfBirth?.toString();
  const oldTob = user.timeOfBirth;
  const oldLat = user.latitude;
  const oldLong = user.longitude;

  const updatedUser = await userService.UserUpdate({ details, userId });
  user = updatedUser.user!;

  const dobChanged =
    details.dateOfBirth && details.dateOfBirth.toString() !== oldDob;
  const tobChanged = details.timeOfBirth && details.timeOfBirth !== oldTob;
  const latChanged = details.latitude && details.latitude !== oldLat;
  const longChanged = details.longitude && details.longitude !== oldLong;

  const rashiMissing =
    !user.astrologyDetail?.sunSign || !user.astrologyDetail?.moonSign;

  const shouldRecalculateRashi =
    (dobChanged || tobChanged || latChanged || longChanged || rashiMissing) &&
    user.dateOfBirth &&
    user.timeOfBirth &&
    user.latitude &&
    user.longitude;

  if (shouldRecalculateRashi) {
    const date = new Date(user.dateOfBirth!).toISOString().split("T")[0];
    const datetime = `${date}T${user.timeOfBirth}:00+05:30`;

    const latitude = Number(user.latitude);
    const longitude = Number(user.longitude);

    const token = await getAstroAccessToken();
    const { sunSign, moonSign, report, nakshatra, zodiac } =
      await getSunAndMoonSign({
        datetime,
        latitude,
        longitude,
        token,
      });

    const moonReportData = {
      report,
      nakshatra,
      zodiac,
      rasi: moonSign,
      lastGenerated: new Date(),
    };

    const sunReportData = {
      report,
      nakshatra,
      zodiac,
      rasi: sunSign,
      lastGenerated: new Date(),
    };

    user = (
      await userService.UserUpdate({
        userId,
        details: {
          astrologyDetail: { sunSign: sunSign.name, moonSign: moonSign.name },
          astrologyReports: {
            moon: moonReportData,
            sun: sunReportData,
          },
        },
      })
    ).user!;
  }

  return res.status(200).json({
    user,
    message: updatedUser.message,
    success: true,
  });
});

//report user
export const reportUser = catchAsync(async (req, res) => {
  const reportedBy = req.user._id;
  const { userId } = req.params;
  const { reason, from, fromId } = req.body;
  const report = await userService.reportUser({
    reportedBy,
    userId,
    fromId,
    reason,
    from,
  });

  res.status(201).json({ message: "Report Submitted", report });
});

//fetch single user data
export const fetchSingleUser = catchAsync(async (req, res) => {
  const user = await userService.fetchSingleUser(req.params.userId);
  res.status(200).json({ message: "User Fetched successfull", user });
});
