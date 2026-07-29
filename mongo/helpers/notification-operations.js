import Notification from '../src/notifications/notification.model.js';

export const createNotification = async ({ userId, type, title, message }) => {
  return Notification.create({ userId, type, title, message });
};

export const listNotificationsHelper = async (userId) => {
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();

  return notifications.map((notification) => ({
    id: String(notification._id),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  }));
};

export const countUnreadNotificationsHelper = async (userId) => {
  return Notification.countDocuments({ userId, isRead: false });
};

export const markNotificationAsReadHelper = async ({ notificationId, userId }) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });

  if (!notification) {
    const error = new Error('Notificacion no encontrada');
    error.status = 404;
    throw error;
  }

  notification.isRead = true;
  await notification.save();

  return notification;
};

export const markAllNotificationsAsReadHelper = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
};
