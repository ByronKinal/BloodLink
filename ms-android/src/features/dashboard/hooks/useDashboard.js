import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import * as appointmentsApi from '../../appointments/api/appointments.api';
import * as rewardsApi from '../../rewards/api/rewards.api';
import * as triageApi from '../../triage/api/triage.api';
import * as dashboardApi from '../api/dashboard.api';

export function useDashboard() {
  const user = useAuthStore((state) => state.user);

  // Widget 1: Próxima Cita
  const [appointment, setAppointment] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [errorAppointment, setErrorAppointment] = useState(null);

  // Widget 2: Saldo Wallet
  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [errorWallet, setErrorWallet] = useState(null);

  // Widget 3: Estadísticas de Impacto
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  // Widget 4: Semáforo de Elegibilidad (Triage)
  const [triage, setTriage] = useState(null);
  const [loadingTriage, setLoadingTriage] = useState(true);
  const [errorTriage, setErrorTriage] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  // Fetch Widget 1: Citas
  const fetchAppointment = async () => {
    setLoadingAppointment(true);
    setErrorAppointment(null);
    try {
      const res = await appointmentsApi.getAppointments();
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setAppointment(list[0]);
      } else {
        setAppointment(null);
      }
    } catch (err) {
      console.log('Dashboard Widget Appointment error:', err?.message);
      setErrorAppointment('No se pudo obtener la cita.');
    } finally {
      setLoadingAppointment(false);
    }
  };

  // Fetch Widget 2: Wallet
  const fetchWallet = async () => {
    setLoadingWallet(true);
    setErrorWallet(null);
    try {
      const userId = user?.id || user?._id || 'me';
      const res = await rewardsApi.getWallet(userId);
      setWallet(res.data?.data || res.data || { balance: 0 });
    } catch (err) {
      console.log('Dashboard Widget Wallet error:', err?.message);
      setErrorWallet('No disponible');
      setWallet({ balance: 0 });
    } finally {
      setLoadingWallet(false);
    }
  };

  // Fetch Widget 3: Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    setErrorStats(null);
    try {
      const res = await dashboardApi.getDashboardStats();
      setStats(res.data?.data || res.data || {});
    } catch (err) {
      console.log('Dashboard Widget Stats error:', err?.message);
      setErrorStats('Estadísticas no disponibles');
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Widget 4: Triage
  const fetchTriage = async () => {
    setLoadingTriage(true);
    setErrorTriage(null);
    try {
      const res = await triageApi.getTriageHistory();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setTriage(data[0] || null);
      } else {
        setTriage(data || null);
      }
    } catch (err) {
      console.log('Dashboard Widget Triage error:', err?.message);
      setErrorTriage('No se pudo verificar el estado');
    } finally {
      setLoadingTriage(false);
    }
  };

  const fetchAllWidgets = useCallback(async () => {
    await Promise.allSettled([
      fetchAppointment(),
      fetchWallet(),
      fetchStats(),
      fetchTriage(),
    ]);
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    fetchAllWidgets();
  }, [fetchAllWidgets]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllWidgets();
  }, [fetchAllWidgets]);

  // Semáforo de Elegibilidad helper
  const getEligibilityStatus = () => {
    if (loadingTriage) return { color: '#94A3B8', text: 'Cargando elegibilidad...', bg: '#F1F5F9', icon: 'time-outline' };
    if (errorTriage) return { color: '#D97706', text: 'Triage pendiente de realizar', bg: '#FEF3C7', icon: 'alert-circle-outline' };
    if (!triage) return { color: '#D97706', text: 'Realiza tu Triage clínico', bg: '#FEF3C7', icon: 'clipboard-outline' };

    const status = (triage.estado || triage.status || triage.resultado || '').toLowerCase();
    const isEligible = triage.esApto ?? triage.isEligible ?? status.includes('apto') ?? true;

    if (isEligible) {
      return { color: '#16A34A', text: 'Elegible para Donar', bg: '#DCFCE7', icon: 'checkmark-circle-outline' };
    } else {
      return { color: '#DC2626', text: 'No Elegible por el momento', bg: '#FEE2E2', icon: 'close-circle-outline' };
    }
  };

  return {
    user,
    appointment,
    loadingAppointment,
    errorAppointment,
    wallet,
    loadingWallet,
    errorWallet,
    stats,
    loadingStats,
    errorStats,
    triage,
    loadingTriage,
    errorTriage,
    refreshing,
    onRefresh,
    eligibility: getEligibilityStatus(),
  };
}
