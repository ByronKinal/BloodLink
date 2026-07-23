import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para la interacción con el Asistente Clínico IA de BloodLink.
 */
export const assistantApi = {
  /**
   * Envía una consulta médica o duda frecuente al motor asistencial de IA.
   * @param {string} prompt 
   */
  askQuestion: async (prompt) => {
    try {
      const response = await mongoApi.post('/api/v1/assistant/query', { prompt });
      return response.data?.data || response.data;
    } catch (err) {
      console.log('Assistant API fallback triggered:', err?.message);
      // Respuesta clinica simulada si el microservicio de IA no esta conectado
      let botResponse = 'Recuerda que debes descansar bien e hidratarte antes de tu donación de sangre.';
      const lower = (prompt || '').toLowerCase();

      if (lower.includes('requisito') || lower.includes('puedo donar')) {
        botResponse = 'Para donar sangre necesitas tener entre 18 y 65 años, pesar más de 50kg y no haber ingerido alcohol en las últimas 24 horas.';
      } else if (lower.includes('tatuaje') || lower.includes('piercing')) {
        botResponse = 'Debes esperar al menos 6 meses tras hacerte un tatuaje o piercing antes de realizar una donación.';
      } else if (lower.includes('tiempo') || lower.includes('espera')) {
        botResponse = 'El tiempo recomendado entre donaciones de sangre total es de 8 semanas (2 meses).';
      }

      return { answer: botResponse };
    }
  },
};

export const askQuestion = assistantApi.askQuestion;
