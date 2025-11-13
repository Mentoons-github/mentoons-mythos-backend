import express from "express";

import userAuth from "../middlewares/authMiddleware";
import { deleteAllNotifications, deleteSingleNotification, getFirst3Notification, getUnreadNotificationsCount, getUserNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/notificationController";

const router = express.Router();

router.get("/", userAuth, getUserNotifications);
router.get(
  "/unread-count",
  userAuth,
  getUnreadNotificationsCount
);
router.patch(
  "/read/:notificationId",
  userAuth,
  markNotificationAsRead
);
router.patch(
  "/read-all",
  userAuth,
 markAllNotificationsAsRead
);
router.delete(
  "/remove/:notificationId",
  userAuth,
  deleteSingleNotification
);
router.delete(
  "/remove-all",
  userAuth,
  deleteAllNotifications
);
router.get("/dashboard", userAuth, getFirst3Notification)

export default router;
