import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para la gestión del Perfil Clínico y Métricas de Donación en MongoDB.
 * Proporciona métodos para consultar y actualizar datos del donante.
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
   * Actualiza los datos del perfil clínico del donante.
   * @param {Object} profileData 
   */
  updateProfile: async (profileData) => {
    const response = await mongoApi.put('/api/v1/profiles/me', profileData);
    return response.data?.data || response.data;
  },

  /**
   * Obtiene las estadísticas acumuladas de donaciones y vidas impactadas.
   */
  getMyStats: async () => {
    const response = await mongoApi.get('/api/v1/reports/my-stats');
    return response.data?.data || response.data;
  },
};

export const getProfileMe = profileApi.getProfileMe;
export const updateProfile = profileApi.updateProfile;
export const getMyStats = profileApi.getMyStats;
