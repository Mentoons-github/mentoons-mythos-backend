import express from "express";
import {
  collectBadge,
  createBadge,
  deleteBadge,
  deleteBadgeFromUser,
  editBadge,
  fetchBadgeAnimation,
  getAllBadges,
  getMyBadges,
  getSingleBadge,
} from "../controllers/badgeController";
import userAuth from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/create", userAuth, createBadge);
router.patch("/collect/:badgeId", userAuth, collectBadge);
router.get("/me", userAuth, getMyBadges);
router.get("/single/:badgeId", userAuth, getSingleBadge);
router.get("/all", userAuth, getAllBadges);
router.patch("/delete/user/:badgeId", userAuth, deleteBadgeFromUser);
router.delete("/delete/:badgeId", userAuth, deleteBadge);
router.patch("/edit/:badgeId", userAuth, editBadge);
router.get("/animation/:badgeId", userAuth, fetchBadgeAnimation);

export default router;
