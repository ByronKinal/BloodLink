import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatAppointmentDate, getAppointmentStatusInfo } from '../../../shared/utils/appointment';

export default function AppointmentCard({ item }) {
  const statusInfo = getAppointmentStatusInfo(item.status);

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="water" size={24} color="#D42040" />
        </View>
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.appointmentDate}>{formatAppointmentDate(item.date)}</Text>
          <Text style={styles.appointmentTime}>{item.time || 'Hora por confirmar'}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.badgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
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
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    textTransform: 'capitalize',
  },
  appointmentTime: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    flexShrink: 1,
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
