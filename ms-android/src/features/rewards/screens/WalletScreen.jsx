import React from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, useWindowDimensions, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../hooks/useWallet';
import WalletBalanceCard from '../components/WalletBalanceCard';
import RewardItemCard from '../components/RewardItemCard';
import NotificationBell from '../../notifications/components/NotificationBell';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import EmptyView from '../../../shared/components/EmptyView';
import AppAlertModal from '../../../shared/components/AppAlertModal';
import AppConfirmModal from '../../../shared/components/AppConfirmModal';

const GRID_BREAKPOINT = 600;

export default function WalletScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const numColumns = width >= GRID_BREAKPOINT ? 2 : 1;

  const {
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
    refetch,
    onRefresh,
    claimReward,
  } = useWallet();

  const balancePoints = wallet?.balancePoints ?? 0;

  return (
    <ImageBackground
      source={require('../../../../assets/img/bloodlink_triage_background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Image
            source={require('../../../../assets/img/bloodlink_icon.png')}
            style={styles.brandIcon}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Mi Billetera</Text>
        </View>
        <NotificationBell dark onPress={() => navigation?.navigate('Notifications')} />
      </View>

      <FlatList
        key={numColumns}
        data={loadingCatalog || catalogError ? [] : rewardsCatalog}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
        ListHeaderComponent={
          <>
            <WalletBalanceCard wallet={wallet} loading={loadingWallet} />
            <View style={styles.sectionTitleRow}>
              <Ionicons name="gift" size={20} color="#D42040" />
              <Text style={styles.sectionTitle}>Beneficios Disponibles</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <RewardItemCard
            reward={item}
            userBalance={balancePoints}
            isClaiming={claimingRewardId === item.id}
            style={numColumns > 1 ? styles.gridItem : undefined}
            onClaim={() => claimReward(item)}
          />
        )}
        ListEmptyComponent={
          loadingCatalog ? (
            <LoadingView message="Cargando catálogo..." />
          ) : catalogError ? (
            <ErrorView message={catalogError} onRetry={refetch} />
          ) : (
            <EmptyView
              icon="gift-outline"
              title="Sin recompensas disponibles"
              subtitle="Vuelve pronto para ver nuevos beneficios por canjear."
            />
          )
        }
      />

      <AppConfirmModal
        visible={!!pendingClaim}
        title="Confirmar canje"
        message={
          pendingClaim
            ? `¿Deseas canjear "${pendingClaim.name}" por ${pendingClaim.requiredPoints} BloodPoints?`
            : ''
        }
        icon="gift"
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        onConfirm={confirmClaim}
        onCancel={cancelClaim}
      />

      <AppAlertModal
        visible={!!alertInfo}
        title={alertInfo?.title}
        message={alertInfo?.message}
        onClose={clearAlert}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 26,
    height: 26,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  content: {
    padding: 16,
    paddingTop: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
});
