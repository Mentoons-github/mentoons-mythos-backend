import {
  getAccessToken,
  getSunAndMoonSign,
} from "../services/astrologyService";
import { UserUpdate } from "../services/userService";
import catchAsync from "../utils/cathAsync";

export const fetchUser = catchAsync(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const details = req.body;
  const userId = req.user._id;

  let updatedUser = await UserUpdate({ details, userId });

  const user = updatedUser.user;

  if (
    user.dateOfBirth &&
    user.timeOfBirth &&
    user.latitude &&
    user.longitude &&
    !user.astrologyDetail?.sunSign &&
    !user.astrologyDetail?.moonSign
  ) {
    const datetime = `${user.dateOfBirth}T${user.timeOfBirth}`;
    const latitude = Number(user.latitude);
    const longitude = Number(user.longitude);

    const token = await getAccessToken();

    const { sunSign, moonSign } = await getSunAndMoonSign({
      datetime,
      latitude,
      longitude,
      token,
    });

    updatedUser = await UserUpdate({
      userId,
      details: {
        astrologyDetail: {
          sunSign,
          moonSign,
        },
      },
    });
  }

  return res.status(200).json({
    message: updatedUser.message,
    success: true,
  });
});
