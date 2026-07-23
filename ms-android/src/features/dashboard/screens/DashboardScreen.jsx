import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mongoApi, postgresApi } from '../../../shared/api/api';
import { useAuthStore } from '../../auth/store/authStore';

export default function DashboardScreen({ navigation }) {
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
      const res = await mongoApi.get('/api/v1/appointments');
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        // filtrar o tomar la más próxima
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
      const res = await postgresApi.get(`/api/v1/wallet/${userId}`).catch(async () => {
        return await postgresApi.get('/api/v1/wallet/me');
      });
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
      const res = await mongoApi.get('/api/v1/reports/my-stats');
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
      const res = await mongoApi.get('/api/v1/triage');
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

  const fetchAllWidgets = async () => {
    await Promise.allSettled([
      fetchAppointment(),
      fetchWallet(),
      fetchStats(),
      fetchTriage(),
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAllWidgets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllWidgets();
  };

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

  const eligibility = getEligibilityStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>¡Hola de nuevo! 👋</Text>
            <Text style={styles.userNameText}>{user?.name || 'Donante de Sangre'}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation?.navigate('Perfil')}
          >
            <Ionicons name="person-circle-outline" size={36} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
      >
        {/* WIDGET 4: Semáforo de Elegibilidad (Triage) */}
        <TouchableOpacity
          style={[styles.eligibilityCard, { backgroundColor: eligibility.bg, borderColor: eligibility.color }]}
          onPress={() => navigation?.navigate('Triage')}
        >
          <Ionicons name={eligibility.icon} size={32} color={eligibility.color} />
          <View style={styles.eligibilityInfo}>
            <Text style={[styles.eligibilityTitle, { color: eligibility.color }]}>
              {eligibility.text}
            </Text>
            <Text style={styles.eligibilitySub}>
              {triage ? 'Basado en tu último cuestionario clínico' : 'Toca aquí para completar tu Triage médico'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={eligibility.color} />
        </TouchableOpacity>

        {/* WIDGET 1: Próxima Cita */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <View style={styles.widgetTitleRow}>
              <Ionicons name="calendar" size={22} color="#D42040" />
              <Text style={styles.widgetTitle}> Próxima Cita</Text>
            </View>
            <TouchableOpacity onPress={() => navigation?.navigate('Citas')}>
              <Text style={styles.widgetActionText}>Ver Citas</Text>
            </TouchableOpacity>
          </View>

          {loadingAppointment ? (
            <ActivityIndicator size="small" color="#D42040" style={{ marginVertical: 12 }} />
          ) : errorAppointment ? (
            <Text style={styles.widgetErrorText}>{errorAppointment}</Text>
          ) : appointment ? (
            <View style={styles.appointmentContent}>
              <Text style={styles.appointmentHospital}>{appointment.location || appointment.bancoSangre || 'Centro de Donación'}</Text>
              <Text style={styles.appointmentTime}>{appointment.scheduledAt || appointment.fecha || 'Fecha por confirmar'}</Text>
            </View>
          ) : (
            <View style={styles.emptyWidget}>
              <Text style={styles.emptyWidgetText}>No tienes citas programadas actualmente.</Text>
            </View>
          )}
        </View>

        {/* WIDGET 2: Saldo Wallet */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <View style={styles.widgetTitleRow}>
              <Ionicons name="wallet" size={22} color="#2563EB" />
              <Text style={styles.widgetTitle}> Saldo de Puntos</Text>
            </View>
            <TouchableOpacity onPress={() => navigation?.navigate('Billetera')}>
              <Text style={styles.widgetActionText}>Ir a Billetera</Text>
            </TouchableOpacity>
          </View>

          {loadingWallet ? (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 12 }} />
          ) : (
            <View style={styles.walletContent}>
              <Text style={styles.walletPoints}>
                {wallet?.balance ?? wallet?.points ?? 0} <Text style={styles.walletUnit}>BloodPoints</Text>
              </Text>
              {errorWallet && <Text style={styles.widgetErrorText}>({errorWallet})</Text>}
            </View>
          )}
        </View>

        {/* WIDGET 3: Estadísticas de Impacto */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <View style={styles.widgetTitleRow}>
              <Ionicons name="stats-chart" size={22} color="#16A34A" />
              <Text style={styles.widgetTitle}> Impacto de Donación</Text>
            </View>
          </View>

          {loadingStats ? (
            <ActivityIndicator size="small" color="#16A34A" style={{ marginVertical: 12 }} />
          ) : errorStats ? (
            <Text style={styles.widgetErrorText}>{errorStats}</Text>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statGridBox}>
                <Text style={styles.statGridVal}>{stats?.totalDonations ?? stats?.donacionesTotales ?? 0}</Text>
                <Text style={styles.statGridLabel}>Donaciones Realizadas</Text>
              </View>
              <View style={styles.statGridBox}>
                <Text style={styles.statGridVal}>{stats?.livesImpacted ?? stats?.vidasImpactadas ?? 0}</Text>
                <Text style={styles.statGridLabel}>Vidas Salvadas</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  profileBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  eligibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  eligibilityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eligibilityTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  eligibilitySub: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  widgetCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  widgetActionText: {
    fontSize: 13,
    color: '#D42040',
    fontWeight: '600',
  },
  appointmentContent: {
    paddingVertical: 4,
  },
  appointmentHospital: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  appointmentTime: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  emptyWidget: {
    paddingVertical: 8,
  },
  emptyWidgetText: {
    fontSize: 13,
    color: '#64748B',
  },
  walletContent: {
    paddingVertical: 4,
  },
  walletPoints: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  walletUnit: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'normal',
  },
  widgetErrorText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statGridBox: {
    flex: 0.48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statGridVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  statGridLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
});
