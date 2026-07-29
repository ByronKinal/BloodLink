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
  getWallet: async (userId) => {
    const response = await postgresApi.get(`/api/v1/wallet/${userId}`);
    return response.data?.data || response.data || { balancePoints: 0, totalEarnedPoints: 0 };
  },

  /**
   * Obtiene la lista de recompensas e incentivos médicos disponibles para canje.
   */
  getAvailableRewards: async () => {
    const response = await postgresApi.get('/api/v1/rewards');
    return response.data?.data || response.data || [];
  },

  /**
   * Realiza el canje de una recompensa utilizando BloodPoints.
   * @param {string} rewardId
   * @param {number} quantity
   */
  claimReward: async (rewardId, quantity = 1) => {
    const response = await postgresApi.post('/api/v1/rewards/redeem', { rewardId, quantity });
    return response.data?.data || response.data;
  },
};

export const getWallet = rewardsApi.getWallet;
export const getAvailableRewards = rewardsApi.getAvailableRewards;
export const claimReward = rewardsApi.claimReward;
