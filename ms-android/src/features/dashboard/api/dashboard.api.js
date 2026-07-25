import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para el resumen del Dashboard del Donante.
 * Proporciona métodos consolidados para métricas, alertas e indicadores clave.
 */
export const dashboardApi = {
  /**
   * Obtiene las estadísticas de impacto y donaciones acumuladas.
   */
  getDashboardStats: async () => {
    const response = await mongoApi.get('/api/v1/reports/my-stats');
    return response.data?.data || response.data || {};
  },

  /**
   * Obtiene alertas sanitarias o recordatorios de donación urgentes.
   */
  getUpcomingAlerts: async () => {
    try {
      const response = await mongoApi.get('/api/v1/alerts');
      return response.data?.data || response.data || [];
    } catch {
      return [];
    }
  },
};

export const getDashboardStats = dashboardApi.getDashboardStats;
export const getUpcomingAlerts = dashboardApi.getUpcomingAlerts;
