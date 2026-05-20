import * as BadgeService from "../services/badgeService";
import catchAsync from "../utils/cathAsync";

//Badge Creation
export const createBadge = catchAsync(async (req, res) => {
  const data = req.body;
  const badge = await BadgeService.createBadge(data);
  console.log(badge,'dddddd')
  res.status(200).json({ message: "Badge created successfully", badge });
});

//collect badge
export const collectBadge = catchAsync(async (req, res) => {
  const { badgeId } = req.params;
  const userId = req.user._id;
  await BadgeService.collectBadge(badgeId, userId);
  res.status(200).json({ message: "Badge collected" });
});

//get user badges
export const getMyBadges = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const userBadges = await BadgeService.getMyBadges(userId);
  res.status(200).json({ message: "My badges fetched", userBadges });
});

//get all badges
export const getAllBadges = catchAsync(async (req, res) => {
  const badges = await BadgeService.getAllBadges();
  res.status(200).json({ message: "Fetched all badges", badges });
});

//get single badges
export const getSingleBadge = catchAsync(async (req, res) => {
  const { badgeId } = req.params;
  const badge = await BadgeService.getSingleBadge(badgeId);
  res.status(200).json({ message: "Badge fetched", badge });
});

//delete user badge
export const deleteBadgeFromUser = catchAsync(async (req, res) => {
  const { badgeId } = req.params;
  const userId = req.user._id;
  await BadgeService.deleteBadgeFromUser(badgeId, userId);
  res.status(200).json({ message: "Badge Removed from your profile" });
});

//delete badge
export const deleteBadge = catchAsync(async (req, res) => {
  const { badgeId } = req.params;
  await BadgeService.deleteBadge(badgeId);
  res.status(200).json({ message: "Badge deleted" });
});

//edit badge
export const editBadge = catchAsync(async (req, res) => {
  const { badgeId } = req.params;
  const badgeData = req.body;
  const editedBadge = await BadgeService.editBadge(badgeId, badgeData);
  res.status(200).json({ message: "Badge edited", editedBadge });
});

export const fetchBadgeAnimation = catchAsync(async (req, res) => {
  const { badgeId } = req.params;
  const animation = await BadgeService.fetchBadgeAnimation(badgeId);
  res.status(200).json(animation);
});
