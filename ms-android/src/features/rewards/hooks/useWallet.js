import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import * as rewardsApi from '../api/rewards.api';
import { getErrorMessage } from '../../../shared/utils/apiError';

/**
 * Hook para la gestión de la Billetera de Puntos (BloodPoints) y el catálogo de Recompensas del donante.
 */
export function useWallet() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id || user?._id;

  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

  const [rewardsCatalog, setRewardsCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const [claimingRewardId, setClaimingRewardId] = useState(null);
  const [pendingClaim, setPendingClaim] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

  const fetchWallet = useCallback(async () => {
    if (!userId) return;
    setLoadingWallet(true);
    try {
      const data = await rewardsApi.getWallet(userId);
      setWallet(data);
    } catch (err) {
      console.log('Error fetching wallet:', err?.message);
      setWallet({ balancePoints: 0, totalEarnedPoints: 0 });
    } finally {
      setLoadingWallet(false);
    }
  }, [userId]);

  const fetchCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setCatalogError(null);
    try {
      const data = await rewardsApi.getAvailableRewards();
      setRewardsCatalog(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Error fetching rewards catalog:', err?.message);
      setCatalogError(getErrorMessage(err, 'No se pudo cargar el catálogo de recompensas.'));
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.allSettled([fetchWallet(), fetchCatalog()]);
    setRefreshing(false);
  }, [fetchWallet, fetchCatalog]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll();
  }, [fetchAll]);

  const performClaim = async (reward) => {
    setPendingClaim(null);
    setClaimingRewardId(reward.id);
    try {
      await rewardsApi.claimReward(reward.id);
      setAlertInfo({ title: 'Canje exitoso', message: `Reclamaste "${reward.name}" correctamente.` });
      await fetchAll();
    } catch (err) {
      const message = getErrorMessage(err, 'No se pudo canjear el beneficio.');
      setAlertInfo({ title: 'No se pudo canjear', message });
    } finally {
      setClaimingRewardId(null);
    }
  };

  const handleClaimReward = (reward) => {
    const currentBalance = wallet?.balancePoints ?? 0;
    if (currentBalance < reward.requiredPoints) {
      setAlertInfo({
        title: 'Puntos insuficientes',
        message: 'No tienes suficientes BloodPoints para canjear este beneficio.',
      });
      return;
    }

    setPendingClaim(reward);
  };

  const confirmClaim = () => {
    if (pendingClaim) performClaim(pendingClaim);
  };

  const cancelClaim = () => setPendingClaim(null);
  const clearAlert = () => setAlertInfo(null);

  return {
    wallet,
    loadingWallet,
    rewardsCatalog,
    loadingCatalog,
    catalogError,
    refreshing,
    claimingRewardId,
    pendingClaim,
    confirmClaim,
    cancelClaim,
    alertInfo,
    clearAlert,
    refetch: fetchAll,
    onRefresh,
    claimReward: handleClaimReward,
  };
}
