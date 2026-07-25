import { postgresApi } from '../../../shared/api/api';

/**
 * Servicio API para la Billetera de Donante y Gestión de Recompensas en PostgreSQL.
 * Proporciona métodos para consultar saldos, historial y canje de puntos.
 */
export const rewardsApi = {
  /**
   * Obtiene la información del saldo y estado de la billetera del donante.
   * @param {string} userId 
   */
  getWallet: async (userId = 'me') => {
    try {
      const response = await postgresApi.get(`/api/v1/wallet/${userId}`);
      return response.data?.data || response.data || { balance: 0, points: 0 };
    } catch {
      const fallbackResponse = await postgresApi.get('/api/v1/wallet/me');
      return fallbackResponse.data?.data || fallbackResponse.data || { balance: 0, points: 0 };
    }
  },

  /**
   * Obtiene la lista de recompensas e incentivos médicos disponibles para canje.
   */
  getAvailableRewards: async () => {
    try {
      const response = await postgresApi.get('/api/v1/rewards');
      return response.data?.data || response.data || [];
    } catch (err) {
      console.log('Error fetching available rewards catalog:', err?.message);
      return [
        { id: '1', title: 'Descuento en Exámenes de Laboratorio', cost: 500, category: 'Salud', icon: 'medical' },
        { id: '2', title: 'Kit Nutricional Post-Donación', cost: 250, category: 'Nutrición', icon: 'nutrition' },
        { id: '3', title: 'Chequeo Médico Preventivo Anual', cost: 1000, category: 'Prevención', icon: 'heart-circle' },
      ];
    }
  },

  /**
   * Realiza el canje de una recompensa utilizando BloodPoints.
   * @param {string} rewardId 
   */
  claimReward: async (rewardId) => {
    const response = await postgresApi.post(`/api/v1/rewards/${rewardId}/claim`);
    return response.data?.data || response.data;
  },

  /**
   * Obtiene el historial de transacciones y puntos ganados/canjeados.
   */
  getTransactionHistory: async () => {
    try {
      const response = await postgresApi.get('/api/v1/wallet/transactions');
      return response.data?.data || response.data || [];
    } catch (err) {
      console.log('Error fetching transaction history:', err?.message);
      return [];
    }
  },
};

export const getWallet = rewardsApi.getWallet;
export const getAvailableRewards = rewardsApi.getAvailableRewards;
export const claimReward = rewardsApi.claimReward;
export const getTransactionHistory = rewardsApi.getTransactionHistory;
