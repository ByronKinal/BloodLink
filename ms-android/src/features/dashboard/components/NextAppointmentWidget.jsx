import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatAppointmentDate, getAppointmentStatusInfo } from '../../../shared/utils/appointment';

export default function NextAppointmentWidget({ loading, error, appointment, onNavigate, onRetry }) {
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
        <View style={styles.errorRow}>
          <Text style={styles.widgetErrorText}>{error}</Text>
          {onRetry ? (
            <TouchableOpacity onPress={onRetry}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : appointment ? (
        <View style={styles.appointmentContent}>
          <Text style={styles.appointmentDateText}>{formatAppointmentDate(appointment.date)}</Text>
          <Text style={styles.appointmentTime}>
            {appointment.time || 'Hora por confirmar'} · {getAppointmentStatusInfo(appointment.status).label}
          </Text>
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
  appointmentDateText: {
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  retryText: {
    fontSize: 12,
    color: '#D42040',
    fontWeight: '600',
  },
});
