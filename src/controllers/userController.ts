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

export const updateUser = catchAsync(async (req, res) => {
  const { data: details } = req.body;

  const userId = req.user._id;
  let updatedUser = await userService.UserUpdate({ details, userId });

  const user = updatedUser.user;

  if (
    user.dateOfBirth &&
    user.timeOfBirth &&
    user.latitude &&
    user.longitude &&
    !user.astrologyDetail?.sunSign &&
    !user.astrologyDetail?.moonSign
  ) {
    const date = new Date(user.dateOfBirth).toISOString().split("T")[0];
    const datetime = `${date}T${user.timeOfBirth}:00+05:30`;
    console.log("Formatted datetime for UserUpdate:", datetime);

    const latitude = Number(user.latitude);
    const longitude = Number(user.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Invalid coordinates");
    }
    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(datetime)
    ) {
      throw new Error("Invalid datetime format");
    }

    const token = await getAstroAccessToken();
    console.log("token :", token);

    const { sunSign, moonSign } = await getSunAndMoonSign({
      datetime,
      latitude,
      longitude,
      token,
    });

    console.log("sun sign :", sunSign, "moon sign :", moonSign);

    updatedUser = await userService.UserUpdate({
      userId,
      details: {
        astrologyDetail: {
          sunSign,
          moonSign,
        },
      },
    });
  }

  console.log("updated user :", updatedUser);

  return res.status(200).json({
    user: updatedUser.user,
    message: updatedUser.message,
    success: true,
  });
});

export const reportUser = catchAsync(async (req, res) => {
  const reportedBy = req.user._id;
  const { userId  } = req.params;
  const { reason, from, fromId } = req.body;
  const report = await userService.reportUser({
    reportedBy,
    userId,
    fromId,
    reason,
    from
  });

  res.status(201).json({ message: "Report Submitted", report });
});
