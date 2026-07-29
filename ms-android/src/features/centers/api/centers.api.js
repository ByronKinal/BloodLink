import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para los Centros de Donación en MongoDB.
 */
export const centersApi = {
  /**
   * Obtiene el listado completo de centros de donación, ordenados por distancia si se envía ubicación.
   * @param {{ latitude?: number, longitude?: number }} coords
   */
  getCenters: async (coords = {}) => {
    const response = await mongoApi.get('/api/v1/donation-centers', {
      params: { lat: coords.latitude, lng: coords.longitude },
    });
    return response.data?.data || response.data || [];
  },

  /**
   * Obtiene los centros con solicitudes urgentes de sangre, ordenados por distancia.
   * @param {{ latitude?: number, longitude?: number }} coords
   */
  getUrgentCenters: async (coords = {}) => {
    const response = await mongoApi.get('/api/v1/donation-centers/urgent', {
      params: { lat: coords.latitude, lng: coords.longitude, limit: 10 },
    });
    return response.data?.data || response.data || [];
  },
};

export const getCenters = centersApi.getCenters;
export const getUrgentCenters = centersApi.getUrgentCenters;
