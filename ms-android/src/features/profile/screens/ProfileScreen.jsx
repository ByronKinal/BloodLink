import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import ProfileUserCard from '../components/ProfileUserCard';
import ProfileStatsSection from '../components/ProfileStatsSection';
import ProfileClinicalInfoCard from '../components/ProfileClinicalInfoCard';

export default function ProfileScreen() {
  const {
    user,
    profile,
    stats,
    loadingProfile,
    loadingStats,
    refreshing,
    profileError,
    onRefresh,
    signOut,
  } = useProfile();

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
        <ProfileUserCard
          donorName={donorName}
          email={email}
          bloodType={bloodType}
          rhFactor={rhFactor}
        />

        <Text style={styles.sectionTitle}>Impacto de Donación</Text>
        <ProfileStatsSection
          loading={loadingStats}
          totalDonations={totalDonations}
          livesImpacted={livesImpacted}
        />

        <Text style={styles.sectionTitle}>Información Clínica y Contacto</Text>
        <ProfileClinicalInfoCard
          loading={loadingProfile}
          profileError={profileError}
          phone={phone}
          email={email}
        />

        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    marginTop: 4,
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
