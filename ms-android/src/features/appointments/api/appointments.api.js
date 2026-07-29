import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para la gestión de Citas de Donación en MongoDB.
 * Proporciona métodos completos para consultar, agendar y cancelar citas.
 */
export const appointmentsApi = {
  /**
   * Obtiene el listado completo de citas agendadas por el donante.
   */
  getAppointments: async () => {
    const response = await mongoApi.get('/api/v1/appointments');
    return response.data?.data || response.data || [];
  },

  /**
   * Obtiene los detalles de una cita específica por ID.
   * @param {string} appointmentId 
   */
  getAppointmentById: async (appointmentId) => {
    const response = await mongoApi.get(`/api/v1/appointments/${appointmentId}`);
    return response.data?.data || response.data;
  },

  /**
   * Agenda una nueva cita de donación de sangre.
   * @param {Object} appointmentData 
   */
  createAppointment: async (appointmentData) => {
    const response = await mongoApi.post('/api/v1/appointments', appointmentData);
    return response.data?.data || response.data;
  },

  /**
   * Cancela una cita de donación activa.
   * @param {string} appointmentId
   */
  cancelAppointment: async (appointmentId) => {
    const response = await mongoApi.patch(`/api/v1/appointments/${appointmentId}/cancel`);
    return response.data?.data || response.data;
  },

  /**
   * Obtiene los horarios disponibles de un centro de donación para una fecha.
   * @param {string} date formato YYYY-MM-DD
   * @param {string} donationCenterId
   */
  getAvailability: async (date, donationCenterId) => {
    const response = await mongoApi.get('/api/v1/appointments/availability', {
      params: { date, donationCenterId },
    });
    return response.data;
  },
};

export const getAppointments = appointmentsApi.getAppointments;
export const getAppointmentById = appointmentsApi.getAppointmentById;
export const createAppointment = appointmentsApi.createAppointment;
export const cancelAppointment = appointmentsApi.cancelAppointment;
export const getAvailability = appointmentsApi.getAvailability;
