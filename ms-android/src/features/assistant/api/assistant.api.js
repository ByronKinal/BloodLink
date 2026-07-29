import { mongoApi } from '../../../shared/api/api';

/**
 * Servicio API para la interacción con el Asistente Clínico IA de BloodLink.
 * El body solo lleva `question`: la identidad del donante se toma del JWT en el backend.
 */
export const assistantApi = {
  /**
   * Envía una consulta médica o duda frecuente al motor asistencial de IA.
   * @param {string} question
   */
  askQuestion: async (question) => {
    const response = await mongoApi.post('/api/v1/ai/donation-assistant', { question });
    return response.data;
  },
};

export const askQuestion = assistantApi.askQuestion;
