import { mongoApi, postgresApi } from '../../../shared/api/api';

/**
 * Servicio API para la gestión del Perfil Clínico y Métricas de Donación en MongoDB.
 * Proporciona métodos para consultar datos del donante.
 */
export const profileApi = {
  /**
   * Obtiene la información del perfil del donante autenticado.
   */
  getProfileMe: async () => {
    const response = await mongoApi.get('/api/v1/profiles/me');
    return response.data?.data || response.data;
  },

  /**
   * Obtiene las estadísticas acumuladas de donaciones y vidas impactadas.
   */
  getMyStats: async () => {
    const response = await mongoApi.get('/api/v1/reports/my-stats');
    return response.data?.data || response.data;
  },

  /**
   * Actualiza los datos del usuario (incluida la foto de perfil) en el servicio de PostgreSQL.
   */
  updateUser: async (userId, formData) => {
    const response = await postgresApi.patch(`/api/v1/users/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data || response.data;
  },
};

export const getProfileMe = profileApi.getProfileMe;
export const getMyStats = profileApi.getMyStats;
export const updateUser = profileApi.updateUser;
