import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para las Notificaciones del donante en MongoDB.
 */
export const notificationsApi = {
  /**
   * Obtiene el listado de notificaciones y el conteo de no leídas.
   */
  getNotifications: async () => {
    const response = await mongoApi.get('/api/v1/notifications');
    return response.data?.data || { notifications: [], unreadCount: 0 };
  },

  /**
   * Marca una notificación como leída.
   * @param {string} notificationId
   */
  markAsRead: async (notificationId) => {
    const response = await mongoApi.patch(`/api/v1/notifications/${notificationId}/read`);
    return response.data?.data || response.data;
  },

  /**
   * Marca todas las notificaciones del donante como leídas.
   */
  markAllAsRead: async () => {
    const response = await mongoApi.patch('/api/v1/notifications/read-all');
    return response.data;
  },
};

export const getNotifications = notificationsApi.getNotifications;
export const markAsRead = notificationsApi.markAsRead;
export const markAllAsRead = notificationsApi.markAllAsRead;
