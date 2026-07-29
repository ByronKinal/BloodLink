import mongoose from 'mongoose';
import { asyncHandler } from '../../middlewares/errorHandler.js';
import {
  countUnreadNotificationsHelper,
  listNotificationsHelper,
  markAllNotificationsAsReadHelper,
  markNotificationAsReadHelper,
} from '../../helpers/notification-operations.js';

const ensureMongoReady = () => mongoose.connection.readyState === 1;

export const listMyNotifications = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({ success: false, message: 'MongoDB no esta conectado' });
  }

  const [notifications, unreadCount] = await Promise.all([
    listNotificationsHelper(req.userId),
    countUnreadNotificationsHelper(req.userId),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Notificaciones obtenidas exitosamente',
    data: { notifications, unreadCount },
  });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({ success: false, message: 'MongoDB no esta conectado' });
  }

  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return res.status(400).json({ success: false, message: 'ID invalido' });
  }

  try {
    const notification = await markNotificationAsReadHelper({ notificationId, userId: req.userId });
    return res.status(200).json({
      success: true,
      message: 'Notificacion marcada como leida',
      data: notification,
    });
  } catch (error) {
    return res.status(error.status || 400).json({ success: false, message: error.message });
  }
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  if (!ensureMongoReady()) {
    return res.status(503).json({ success: false, message: 'MongoDB no esta conectado' });
  }

  await markAllNotificationsAsReadHelper(req.userId);

  return res.status(200).json({
    success: true,
    message: 'Todas las notificaciones fueron marcadas como leidas',
  });
});
