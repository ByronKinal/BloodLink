import React from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, useWindowDimensions } from 'react-native';
import { useWallet } from '../hooks/useWallet';
import WalletBalanceCard from '../components/WalletBalanceCard';
import RewardItemCard from '../components/RewardItemCard';
import LoadingView from '../../../shared/components/LoadingView';
import ErrorView from '../../../shared/components/ErrorView';
import EmptyView from '../../../shared/components/EmptyView';

const GRID_BREAKPOINT = 600;

export default function WalletScreen() {
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
    refetch,
    onRefresh,
    claimReward,
  } = useWallet();

  const balancePoints = wallet?.balancePoints ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Billetera de Donante</Text>
        <Text style={styles.headerSubtitle}>Tus puntos acumulados e incentivos de salud</Text>
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
            <Text style={styles.sectionTitle}>Beneficios Disponibles</Text>
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
});
