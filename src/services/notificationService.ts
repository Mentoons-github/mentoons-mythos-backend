import Notification from "../models/notificationModel";

// Get all notifications for a user
export const getNotifications = async (
  userId: string,
  limit: number,
  lastDate?: string
) => {
  const query: any = { receiverId: userId, isDeleted: false };
  if (lastDate) {
    query.createdAt = { $lt: new Date(lastDate) };
  }
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return notifications;
};

// Get unread notifications count
export const getUnreadCount = async (userId: string) => {
  return await Notification.countDocuments({
    isDeleted: false,
    receiverId: userId,
    isRead: false,
  });
};

// Mark notification as read
export const markAsRead = async (notificationId: string) => {
  const updated = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
  return updated;
};

// Mark all notifications as read for a user
export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany({ receiverId: userId }, { isRead: true });
};

// Soft delete a single notification
export const deleteSingleNotification = async (notificationId: string) => {
  const deleted = await Notification.findByIdAndUpdate(
    notificationId,
    { isDeleted: true },
    { new: true }
  );
  return deleted;
};

// Soft delete all notifications for a user
export const deleteAllNotifications = async (userId: string) => {
  const deleted = await Notification.updateMany(
    { receiverId: userId },
    { isDeleted: true }
  );
  return deleted;
};

//Dashboard notification
export const getFirst3Notification = async (userId: string) => {
  return await Notification.find({
    receiverId: userId,
  })
    .sort({ createdAt: -1 }) 
    .limit(3)
    .lean();
};
