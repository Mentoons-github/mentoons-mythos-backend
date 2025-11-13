import { update } from "lodash";
import * as NotificationService from "../services/notificationService";
import catchAsync from "../utils/cathAsync";

// Get all notifications
export const getUserNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const limit = parseInt(req.query.limit as string) || 10;
  const lastDate = (req.query.lastDate as string) || "";
  const notifications = await NotificationService.getNotifications(
    userId,
    limit,
    lastDate
  );
  res.status(200).json({ notifications });
});

// Get unread count
export const getUnreadNotificationsCount = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const count = await NotificationService.getUnreadCount(userId);
  res.status(200).json({ count });
});

// Mark single as read
export const markNotificationAsRead = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  const updated = await NotificationService.markAsRead(notificationId);
  res.status(200).json({ message: "Notification marked as read", updated });
});

// Mark all as read
export const markAllNotificationsAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await NotificationService.markAllAsRead(userId);
  res.status(200).json({ message: "All notifications marked as read" });
});

//delete one notification
export const deleteSingleNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;
  await NotificationService.deleteSingleNotification(notificationId);
  res.status(200).json({ message: "Notification deleted" });
});

//delete all notification
export const deleteAllNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await NotificationService.deleteAllNotifications(userId);
  res.status(200).json({ message: "All notifications cleared" });
});

//dashboard notification
export const getFirst3Notification = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const notifications = await NotificationService.getFirst3Notification(userId);
  res
    .status(200)
    .json({ message: "First 3 notification fetched", notifications });
});
