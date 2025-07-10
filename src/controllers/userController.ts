import catchAsync from "../utils/cathAsync";

export const fetchUser = catchAsync(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});
