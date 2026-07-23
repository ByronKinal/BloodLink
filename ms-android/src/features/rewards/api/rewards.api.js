import { postgresApi } from '../../../shared/api/api';

export const getWallet = async (userId = 'me') => {
  return await postgresApi.get(`/api/v1/wallet/${userId}`).catch(async () => {
    return await postgresApi.get('/api/v1/wallet/me');
  });
};
