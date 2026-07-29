import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para el resumen del Dashboard del Donante.
 */
export const dashboardApi = {
  /**
   * Obtiene las estadísticas de impacto y donaciones acumuladas.
   */
  getDashboardStats: async () => {
    const response = await mongoApi.get('/api/v1/reports/my-stats');
    return response.data?.data || response.data || {};
  },
};

export const getDashboardStats = dashboardApi.getDashboardStats;
