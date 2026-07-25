import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useDashboard } from '../hooks/useDashboard';
import DashboardHeader from '../components/DashboardHeader';
import EligibilityWidget from '../components/EligibilityWidget';
import NextAppointmentWidget from '../components/NextAppointmentWidget';
import WalletWidget from '../components/WalletWidget';
import DonationStatsWidget from '../components/DonationStatsWidget';

export default function DashboardScreen({ navigation }) {
  const {
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
    refreshing,
    onRefresh,
    eligibility,
  } = useDashboard();

  return (
    <View style={styles.container}>
      <DashboardHeader user={user} onOpenProfile={() => navigation?.navigate('Perfil')} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
      >
        <EligibilityWidget
          eligibility={eligibility}
          hasTriage={Boolean(triage)}
          onPress={() => navigation?.navigate('Triage')}
        />

        <NextAppointmentWidget
          loading={loadingAppointment}
          error={errorAppointment}
          appointment={appointment}
          onNavigate={() => navigation?.navigate('Citas')}
        />

        <WalletWidget
          loading={loadingWallet}
          wallet={wallet}
          error={errorWallet}
          onNavigate={() => navigation?.navigate('Billetera')}
        />

        <DonationStatsWidget
          loading={loadingStats}
          error={errorStats}
          stats={stats}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
  },
});
