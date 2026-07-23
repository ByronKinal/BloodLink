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
import { postgresApi } from '../../../shared/api/api';
import { useAuthStore } from '../../auth/store/authStore';

export default function WalletScreen() {
  const user = useAuthStore((state) => state.user);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchWallet = async () => {
    try {
      setError(null);
      const userId = user?.id || user?._id || 'me';
      const response = await postgresApi.get(`/api/v1/wallet/${userId}`).catch(async () => {
        return await postgresApi.get('/api/v1/wallet/me');
      });
      setWallet(response.data?.data || response.data || { balance: 0, points: 0 });
    } catch (err) {
      console.log('Error fetching wallet:', err?.message);
      setError('No se pudo cargar la información de la billetera.');
      setWallet({ balance: 0, points: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallet();
  };

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
        <View style={styles.cardWallet}>
          <Text style={styles.cardLabel}>Saldo de Puntos BloodPoints</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" style={{ marginVertical: 10 }} />
          ) : (
            <Text style={styles.cardBalance}>
              {wallet?.balance ?? wallet?.points ?? 0} <Text style={styles.ptsText}>pts</Text>
            </Text>
          )}
          <Text style={styles.cardFooter}>Canjeables por beneficios médicos y farmacéuticos</Text>
        </View>

        <Text style={styles.sectionTitle}>Beneficios Disponibles</Text>

        <View style={styles.rewardCard}>
          <Ionicons name="medical" size={32} color="#D42040" />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>Descuento en Exámenes de Laboratorio</Text>
            <Text style={styles.rewardCost}>500 BloodPoints</Text>
          </View>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Canjear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rewardCard}>
          <Ionicons name="nutrition" size={32} color="#2E7D32" />
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardTitle}>Kit Nutricional Post-Donación</Text>
            <Text style={styles.rewardCost}>250 BloodPoints</Text>
          </View>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Canjear</Text>
          </TouchableOpacity>
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
  cardWallet: {
    backgroundColor: '#D42040',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#D42040',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardLabel: {
    color: '#FFCDD2',
    fontSize: 14,
    fontWeight: '600',
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  ptsText: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  cardFooter: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  rewardCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  rewardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  rewardCost: {
    fontSize: 13,
    color: '#D42040',
    marginTop: 2,
    fontWeight: '600',
  },
  claimButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  claimButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
