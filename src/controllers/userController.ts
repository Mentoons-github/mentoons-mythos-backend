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

  const userUpdation = await UserUpdate({ details, userId });

  return res.status(200).json({
    message: userUpdation,
    success: true,
  });
});
