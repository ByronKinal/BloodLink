import React from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { useWallet } from '../hooks/useWallet';
import WalletBalanceCard from '../components/WalletBalanceCard';
import RewardItemCard from '../components/RewardItemCard';

export default function WalletScreen() {
  const { wallet, loading, refreshing, onRefresh } = useWallet();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Billetera de Donante</Text>
        <Text style={styles.headerSubtitle}>Tus puntos acumulados e incentivos de salud</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
      >
        <WalletBalanceCard wallet={wallet} loading={loading} />

        <Text style={styles.sectionTitle}>Beneficios Disponibles</Text>

        <RewardItemCard
          iconName="medical"
          iconColor="#D42040"
          title="Descuento en Exámenes de Laboratorio"
          cost="500 BloodPoints"
        />

        <RewardItemCard
          iconName="nutrition"
          iconColor="#2E7D32"
          title="Kit Nutricional Post-Donación"
          cost="250 BloodPoints"
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
});
