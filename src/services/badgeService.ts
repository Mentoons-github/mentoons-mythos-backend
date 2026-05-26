import { Types } from "mongoose";
import { CriteriaType, IBadge } from "../interfaces/badgeInterface";
import Badge from "../models/badgeModel";
import User from "../models/userModel";
import CustomError from "../utils/customError";
import axios from "axios";

export const createBadge = async (data: IBadge) => {
  const badge = await Badge.create(data);
  return badge;
};

// assign badge
export const assignBadge = async (userId: string, badgeId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const badge = await Badge.findById(badgeId);
  if (!badge) throw new Error("Badge not found");

  const existing = user.badges.some(
    (b) => b.badge.toString() === badge._id.toString(),
  );

  if (existing) {
    return { success: false, message: "Badge already assigned" };
  }

  user.badges.push({
    badge: badge._id,
  });

  await user.save();

  return {
    success: true,
    message: "Badge assigned successfully",
  };
};

//collect badge
export const collectBadge = async (badgeId: string, userId: string) => {
  if (!badgeId) {
    throw new CustomError("Badge is required", 400);
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  const selectedBadge = user.badges.find(
    (badge) => badge.badge.toString() === badgeId,
  );
  console.log(selectedBadge,'badgeessss')
  if (!selectedBadge) {
    throw new CustomError("Badge not found", 404);

  }

  selectedBadge.isCollected = true;
  selectedBadge.isDeleted = false;
  await user.save();
};

//my badges
export const getMyBadges = async (userId: string) => {
  const userBadges = await User.findById(userId)
    .select("badges")
    .populate("badges.badge");

  if (!userBadges) {
    return null;
  }
  return userBadges;
};

//get all badges
export const getAllBadges = async () => {
  const badges = await Badge.find();
  return badges;
};

// get single badge
export const getSingleBadge = async (badgeId: string) => {
  const badge = await Badge.findById(badgeId);
  if (!badge) {
    throw new CustomError("Badge not found", 400);
  }
  return badge;
};

//delte badge user
export const deleteBadgeFromUser = async (badgeId: string, userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  const selectedBadge = user.badges.find((b) => b.badge.toString() === badgeId);

  if (!selectedBadge) {
    throw new CustomError("Badge not found", 404);
  }

  if (selectedBadge.isDeleted) {
    throw new CustomError("Badge already deleted", 400);
  }

  selectedBadge.isDeleted = true;

  await user.save();

  return selectedBadge;
};

//delete badge
export const deleteBadge = async (badgeId: string) => {
  const deletedBadge = await Badge.findByIdAndDelete(badgeId);
  if (!deletedBadge) throw new CustomError("Badge not found", 404);
};

//edit badge
export const editBadge = async (badgeId: string, badgeData: IBadge) => {
  const editedBadge = await Badge.findByIdAndUpdate(
    badgeId,
    {
      animation: badgeData.animation,
      name: badgeData.name,
      description: badgeData.description,
      image: badgeData.image,
      criteria: badgeData.criteria,
    },
    { new: true },
  );
  if (!editedBadge) {
    throw new CustomError("Badge not found", 404);
  }
  return editedBadge;
};

// fetch animation
export const fetchBadgeAnimation = async (badgeId: string) => {
  const badge = await Badge.findById(badgeId).select("animation");

  if (!badge || !badge.animation) {
    throw new Error("Animation not found");
  }

  const response = await axios.get(badge.animation);

  return response.data;
};
