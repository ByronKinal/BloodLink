import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para la evaluación clínica y el Triage Médico del Donante en MongoDB.
 * Permite registrar y evaluar criterios de elegibilidad médica y recuperar evaluaciones históricas.
 */
export const triageApi = {
  /**
   * Consulta el historial completo de evaluaciones clínicas de triage del donante.
   */
  getTriageHistory: async () => {
    const response = await mongoApi.get('/api/v1/triage');
    return response.data?.data || response.data || [];
  },

  /**
   * Obtiene la última evaluación clínica realizada por el donante.
   */
  getLatestTriage: async () => {
    const response = await mongoApi.get('/api/v1/triage/latest').catch(async () => {
      const all = await mongoApi.get('/api/v1/triage');
      const list = all.data?.data || all.data || [];
      return Array.isArray(list) ? list[0] : list;
    });
    return response.data?.data || response.data;
  },

  /**
   * Envia un nuevo cuestionario de triage médico para su dictamen clínico.
   * @param {Object} payload 
   */
  submitTriage: async (payload) => {
    const response = await mongoApi.post('/api/v1/triage', payload);
    return response.data?.data || response.data;
  },

  /**
   * Consulta el detalle de un expediente de triage específico.
   * @param {string} triageId 
   */
  getTriageById: async (triageId) => {
    const response = await mongoApi.get(`/api/v1/triage/${triageId}`);
    return response.data?.data || response.data;
  },
};

export const getTriageHistory = triageApi.getTriageHistory;
export const getLatestTriage = triageApi.getLatestTriage;
export const submitTriage = triageApi.submitTriage;
export const getTriageById = triageApi.getTriageById;
