import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  listMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './notification.controller.js';

const router = Router();

router.get('/', validateJWT, listMyNotifications);
router.patch('/read-all', validateJWT, markAllNotificationsAsRead);
router.patch('/:notificationId/read', validateJWT, markNotificationAsRead);

export default router;
