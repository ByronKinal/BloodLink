import React from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import ProfileUserCard from '../components/ProfileUserCard';
import ProfileStatsSection from '../components/ProfileStatsSection';
import ProfileClinicalInfoCard from '../components/ProfileClinicalInfoCard';
import AppAlertModal from '../../../shared/components/AppAlertModal';

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
    refetch,
    signOut,
    uploadingPhoto,
    photoError,
    clearPhotoError,
    changeProfilePicture,
  } = useProfile();

  const donorName =
    [user?.name, user?.surname].filter(Boolean).join(' ') ||
    user?.email?.split('@')[0] ||
    'Donante BloodLink';
  const bloodType = user?.bloodType || profile?.donorData?.bloodType || 'No registrado';
  const phone = user?.phone || 'No registrado';
  const email = user?.email || profile?.email || 'Sin correo';
  const lastDonationDate = profile?.donorData?.lastDonationDate || null;
  const totalDonations = stats?.donationCount ?? 0;
  const totalLitersDonated = stats?.totalBloodDonatedLiters ?? 0;

  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_background_clean.png')}
      style={styles.container}
      resizeMode="cover"
    >
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
          profilePicture={user?.profilePicture}
          uploading={uploadingPhoto}
          onChangePhoto={changeProfilePicture}
        />

        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>Impacto de Donación</Text>
        </View>
        <ProfileStatsSection
          loading={loadingStats}
          totalDonations={totalDonations}
          totalLitersDonated={totalLitersDonated}
        />

        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>Información Clínica y Contacto</Text>
        </View>
        <ProfileClinicalInfoCard
          loading={loadingProfile}
          profileError={profileError}
          phone={phone}
          email={email}
          lastDonationDate={lastDonationDate}
          onRetry={refetch}
        />

        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <AppAlertModal
        visible={!!photoError}
        title="No se pudo actualizar la foto"
        message={photoError}
        onClose={clearPhotoError}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#D42040',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
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
