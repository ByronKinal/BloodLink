import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import * as rewardsApi from '../api/rewards.api';

export function useWallet() {
  const user = useAuthStore((state) => state.user);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchWallet = useCallback(async () => {
    try {
      setError(null);
      const userId = user?.id || user?._id || 'me';
      const response = await rewardsApi.getWallet(userId);
      setWallet(response.data?.data || response.data || { balance: 0, points: 0 });
    } catch (err) {
      console.log('Error fetching wallet:', err?.message);
      setError('No se pudo cargar la información de la billetera.');
      setWallet({ balance: 0, points: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWallet();
  }, [fetchWallet]);

  return {
    wallet,
    loading,
    refreshing,
    error,
    refetch: fetchWallet,
    onRefresh,
  };
}
