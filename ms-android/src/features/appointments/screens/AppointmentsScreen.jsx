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
import { mongoApi } from '../../../shared/api/api';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setError(null);
      const response = await mongoApi.get('/api/v1/appointments');
      const data = response.data?.data || response.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Error fetching appointments:', err?.message);
      setError('No se pudieron cargar las citas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Citas de Donación</Text>
        <Text style={styles.headerSubtitle}>Gestiona tus agendamientos de donación de sangre</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D42040']} />}
      >
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#D42040" />
            <Text style={styles.loadingText}>Cargando tus citas...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchAppointments}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={64} color="#9E9E9E" />
            <Text style={styles.emptyTitle}>No tienes citas programadas</Text>
            <Text style={styles.emptySub}>Programa una nueva cita en tu centro de donación más cercano.</Text>
          </View>
        ) : (
          appointments.map((item, index) => {
            const dateStr = item.scheduledAt || item.fecha || item.createdAt || 'Fecha pendiente';
            const statusStr = item.status || item.estado || 'PENDIENTE';
            const locationStr = item.location || item.lugar || item.bancoSangre || 'Centro de Donación Principal';

            return (
              <View key={item._id || item.id || index} style={styles.appointmentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="water" size={24} color="#D42040" />
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.hospitalName}>{locationStr}</Text>
                    <Text style={styles.appointmentDate}>{dateStr}</Text>
                  </View>
                  <View style={[styles.badge, statusStr.toUpperCase() === 'COMPLETADA' ? styles.badgeSuccess : styles.badgePending]}>
                    <Text style={styles.badgeText}>{statusStr}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
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
    marginTop: 20,
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
    marginTop: 20,
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
  appointmentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  appointmentDate: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeSuccess: {
    backgroundColor: '#D1FAE5',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#D97706',
  },
});
