import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import * as profileApi from '../api/profile.api';
import { getErrorMessage } from '../../../shared/utils/apiError';

export function useProfile() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [statsError, setStatsError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    // 1. Fetch profile
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const profileRes = await profileApi.getProfileMe();
      setProfile(profileRes);
    } catch (err) {
      console.log('Error loading profile:', err?.message);
      setProfileError(getErrorMessage(err, 'Perfil no encontrado o aún no generado.'));
    } finally {
      setLoadingProfile(false);
    }

    // 2. Fetch stats
    setLoadingStats(true);
    setStatsError(null);
    try {
      const statsRes = await profileApi.getMyStats();
      setStats(statsRes);
    } catch (err) {
      console.log('Error loading stats:', err?.message);
      setStatsError(getErrorMessage(err, 'No se pudieron obtener las estadísticas de impacto.'));
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    user,
    profile,
    stats,
    loadingProfile,
    loadingStats,
    refreshing,
    profileError,
    statsError,
    onRefresh,
    refetch: fetchProfileData,
    signOut: clearSession,
  };
}
