import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentCard({ item }) {
  const dateStr = item.scheduledAt || item.fecha || item.createdAt || 'Fecha pendiente';
  const statusStr = item.status || item.estado || 'PENDIENTE';
  const locationStr = item.location || item.lugar || item.bancoSangre || 'Centro de Donación Principal';

  const isSuccess = statusStr.toUpperCase() === 'COMPLETADA';

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="water" size={24} color="#D42040" />
        </View>
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.hospitalName}>{locationStr}</Text>
          <Text style={styles.appointmentDate}>{dateStr}</Text>
        </View>
        <View style={[styles.badge, isSuccess ? styles.badgeSuccess : styles.badgePending]}>
          <Text style={[styles.badgeText, isSuccess ? styles.badgeTextSuccess : styles.badgeTextPending]}>
            {statusStr}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  badgeTextPending: {
    color: '#D97706',
  },
  badgeTextSuccess: {
    color: '#16A34A',
  },
});
