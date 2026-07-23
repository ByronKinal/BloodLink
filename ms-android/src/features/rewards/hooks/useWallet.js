import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import * as rewardsApi from '../api/rewards.api';

/**
 * Hook para la gestión de la Billetera de Puntos (BloodPoints) y Recompensas del donante.
 */
export function useWallet() {
  const user = useAuthStore((state) => state.user);
  const [wallet, setWallet] = useState(null);
  const [rewardsCatalog, setRewardsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);

  const fetchWalletData = useCallback(async () => {
    try {
      setError(null);
      const userId = user?.id || user?._id || 'me';

      const [walletData, catalogData] = await Promise.allSettled([
        rewardsApi.getWallet(userId),
        rewardsApi.getAvailableRewards(),
      ]);

      if (walletData.status === 'fulfilled') {
        setWallet(walletData.value);
      } else {
        setWallet({ balance: 0, points: 0 });
      }

      if (catalogData.status === 'fulfilled') {
        setRewardsCatalog(catalogData.value);
      }
    } catch (err) {
      console.log('Error fetching wallet data:', err?.message);
      setError('No se pudo cargar la información de la billetera.');
      setWallet({ balance: 0, points: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWalletData();
  }, [fetchWalletData]);

  const handleClaimReward = async (rewardId) => {
    setClaimLoading(true);
    try {
      const result = await rewardsApi.claimReward(rewardId);
      await fetchWalletData();
      return { success: true, data: result };
    } catch (err) {
      console.log('Error claiming reward:', err?.message);
      return { success: false, error: err?.response?.data?.message || 'No se pudo canjear el beneficio.' };
    } finally {
      setClaimLoading(false);
    }
  };

  return {
    wallet,
    rewardsCatalog,
    loading,
    refreshing,
    error,
    claimLoading,
    refetch: fetchWalletData,
    onRefresh,
    claimReward: handleClaimReward,
  };
}
