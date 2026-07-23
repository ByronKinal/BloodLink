import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mongoApi } from '../../../shared/api/api';
import { useAuthStore } from '../../auth/store/authStore';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [statsError, setStatsError] = useState(null);

  const fetchProfileData = async () => {
    // 1. Fetch profile
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const profileRes = await mongoApi.get('/api/v1/profiles/me');
      setProfile(profileRes.data?.data || profileRes.data);
    } catch (err) {
      console.log('Error loading profile:', err?.message);
      setProfileError('Perfil no encontrado o aún no generado.');
    } finally {
      setLoadingProfile(false);
    }

    // 2. Fetch stats
    setLoadingStats(true);
    setStatsError(null);
    try {
      const statsRes = await mongoApi.get('/api/v1/reports/my-stats');
      setStats(statsRes.data?.data || statsRes.data);
    } catch (err) {
      console.log('Error loading stats:', err?.message);
      setStatsError('No se pudieron obtener las estadísticas de impacto.');
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleLogout = () => {
    clearSession();
  };

  const donorName = profile?.nombre || profile?.name || user?.name || user?.email?.split('@')[0] || 'Donante BloodLink';
  const bloodType = profile?.tipoSangre || profile?.bloodType || user?.bloodType || 'O+';
  const rhFactor = profile?.rhFactor || '+';
  const phone = profile?.telefono || profile?.phone || user?.phone || 'No registrado';
  const email = profile?.correo || profile?.email || user?.email || 'Sin correo';
  const totalDonations = stats?.totalDonations ?? stats?.donacionesTotales ?? profile?.totalDonations ?? 0;
  const livesImpacted = stats?.livesImpacted ?? stats?.vidasImpactadas ?? totalDonations * 3;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil Médico del Donante</Text>
        <Text style={styles.headerSubtitle}>Tus datos de salud y resumen de impacto</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#D42040" />
          </View>
          <Text style={styles.userName}>{donorName}</Text>
          <Text style={styles.userEmail}>{email}</Text>

          <View style={styles.bloodBadgeContainer}>
            <View style={styles.bloodBadge}>
              <Ionicons name="water" size={16} color="#FFF" />
              <Text style={styles.bloodBadgeText}>Tipo: {bloodType} ({rhFactor})</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <Text style={styles.sectionTitle}>Impacto de Donación</Text>
        {loadingStats ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#D42040" />
          </View>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="heart" size={28} color="#D42040" />
              <Text style={styles.statNumber}>{totalDonations}</Text>
              <Text style={styles.statLabel}>Donaciones</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="people" size={28} color="#2563EB" />
              <Text style={styles.statNumber}>{livesImpacted}</Text>
              <Text style={styles.statLabel}>Vidas Impactadas</Text>
            </View>
          </View>
        )}

        {/* Personal Clinical Info */}
        <Text style={styles.sectionTitle}>Información Clínica y Contacto</Text>
        {loadingProfile ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#D42040" />
          </View>
        ) : profileError ? (
          <View style={styles.infoCardError}>
            <Ionicons name="information-circle-outline" size={32} color="#D97706" />
            <Text style={styles.infoErrorText}>{profileError}</Text>
            <Text style={styles.infoErrorSub}>Realiza tu primer Triage o consulta médica para actualizar tu perfil.</Text>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#64748B" />
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoVal}>{phone}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#64748B" />
              <Text style={styles.infoLabel}>Correo:</Text>
              <Text style={styles.infoVal}>{email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Ionicons name="medkit-outline" size={20} color="#64748B" />
              <Text style={styles.infoLabel}>Estado:</Text>
              <Text style={[styles.infoVal, { color: '#16A34A', fontWeight: 'bold' }]}>Activo para Donar</Text>
            </View>
          </View>
        )}

        {/* Logout Action */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  bloodBadgeContainer: {
    marginTop: 14,
  },
  bloodBadge: {
    backgroundColor: '#D42040',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bloodBadgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    marginTop: 4,
  },
  loadingBox: {
    padding: 20,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 0.48,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  infoCardError: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  infoErrorText: {
    color: '#B45309',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
  },
  infoErrorSub: {
    color: '#92400E',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 10,
    width: 80,
  },
  infoVal: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 30,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
});
