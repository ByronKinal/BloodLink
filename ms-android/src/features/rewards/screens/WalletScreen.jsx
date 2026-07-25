import React from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../hooks/useWallet';
import WalletBalanceCard from '../components/WalletBalanceCard';
import RewardItemCard from '../components/RewardItemCard';

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
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#D42040" />
              <Text style={styles.loadingText}>Cargando catálogo...</Text>
            </View>
          ) : catalogError ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
              <Text style={styles.errorText}>{catalogError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="gift-outline" size={64} color="#9E9E9E" />
              <Text style={styles.emptyTitle}>Sin recompensas disponibles</Text>
              <Text style={styles.emptySub}>Vuelve pronto para ver nuevos beneficios por canjear.</Text>
            </View>
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
  centerContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    marginVertical: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#D42040',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginTop: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});
