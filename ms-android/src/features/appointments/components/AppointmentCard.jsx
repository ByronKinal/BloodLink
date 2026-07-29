import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatAppointmentDate, getAppointmentStatusInfo } from '../../../shared/utils/appointment';
import AppConfirmModal from '../../../shared/components/AppConfirmModal';

export default function AppointmentCard({ item, onCancel, isCancelling }) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const statusInfo = getAppointmentStatusInfo(item.status);
  const canCancel = item.status === 'PENDING' || item.status === 'CONFIRMED';

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
    onCancel?.(item._id || item.id);
  };

  return (
    <View style={styles.appointmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="water" size={24} color="#D42040" />
        </View>
        <View style={styles.cardHeaderInfo}>
          <Text style={styles.appointmentDate}>{formatAppointmentDate(item.date)}</Text>
          <Text style={styles.appointmentTime}>{item.time || 'Hora por confirmar'}</Text>
          {item.center?.name ? (
            <View style={styles.centerRow}>
              <Ionicons name="location-outline" size={12} color="#94A3B8" />
              <Text style={styles.centerText} numberOfLines={1}>
                {item.center.name}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.badgeText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>

      {canCancel && onCancel ? (
        <TouchableOpacity
          style={[styles.cancelBtn, isCancelling && styles.cancelBtnDisabled]}
          onPress={() => setConfirmVisible(true)}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Text style={styles.cancelBtnText}>Cancelar Cita</Text>
          )}
        </TouchableOpacity>
      ) : null}

      <AppConfirmModal
        visible={confirmVisible}
        title="Cancelar cita"
        message="¿Deseas cancelar esta cita de donación?"
        icon="close-circle"
        destructive
        confirmLabel="Sí, cancelar"
        cancelLabel="No"
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 1,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  centerText: {
    fontSize: 12,
    color: '#94A3B8',
    flexShrink: 1,
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
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
  },
  cancelBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
