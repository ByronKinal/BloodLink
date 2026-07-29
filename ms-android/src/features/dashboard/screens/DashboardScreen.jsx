import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useDashboard } from '../hooks/useDashboard';
import DashboardHeader from '../components/DashboardHeader';
import BloodTypeStatusCard from '../components/BloodTypeStatusCard';
import QuickActionsRow from '../components/QuickActionsRow';
import DonationStatsWidget from '../components/DonationStatsWidget';
import UrgentCentersSection from '../../centers/components/UrgentCentersSection';

export default function DashboardScreen({ navigation }) {
  const {
    user,
    stats,
    loadingStats,
    errorStats,
    refetchStats,
    refreshing,
    onRefresh,
    eligibility,
  } = useDashboard();

  return (
    <View style={styles.container}>
      <DashboardHeader
        user={user}
        onOpenProfile={() => navigation?.navigate('Perfil')}
        onOpenNotifications={() => navigation?.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
      >
        <BloodTypeStatusCard
          bloodType={user?.bloodType}
          eligibility={eligibility}
          onPress={() => navigation?.navigate('Triage')}
        />

        <UrgentCentersSection onSeeAll={() => navigation?.navigate('DonationCenters')} />

        <QuickActionsRow
          onSchedule={() => navigation?.navigate('Citas')}
          onSeeCenters={() => navigation?.navigate('DonationCenters')}
        />

        <DonationStatsWidget
          loading={loadingStats}
          error={errorStats}
          stats={stats}
          onRetry={refetchStats}
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
