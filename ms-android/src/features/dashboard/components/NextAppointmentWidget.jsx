import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NextAppointmentWidget({ loading, error, appointment, onNavigate }) {
  return (
    <View style={styles.widgetCard}>
      <View style={styles.widgetHeader}>
        <View style={styles.widgetTitleRow}>
          <Ionicons name="calendar" size={22} color="#D42040" />
          <Text style={styles.widgetTitle}> Próxima Cita</Text>
        </View>
        <TouchableOpacity onPress={onNavigate}>
          <Text style={styles.widgetActionText}>Ver Citas</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#D42040" style={{ marginVertical: 12 }} />
      ) : error ? (
        <Text style={styles.widgetErrorText}>{error}</Text>
      ) : appointment ? (
        <View style={styles.appointmentContent}>
          <Text style={styles.appointmentHospital}>{appointment.location || appointment.bancoSangre || 'Centro de Donación'}</Text>
          <Text style={styles.appointmentTime}>{appointment.scheduledAt || appointment.fecha || 'Fecha por confirmar'}</Text>
        </View>
      ) : (
        <View style={styles.emptyWidget}>
          <Text style={styles.emptyWidgetText}>No tienes citas programadas actualmente.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  widgetCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  widgetActionText: {
    fontSize: 13,
    color: '#D42040',
    fontWeight: '600',
  },
  appointmentContent: {
    paddingVertical: 4,
  },
  appointmentHospital: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  appointmentTime: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  emptyWidget: {
    paddingVertical: 8,
  },
  emptyWidgetText: {
    fontSize: 13,
    color: '#64748B',
  },
  widgetErrorText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
});
