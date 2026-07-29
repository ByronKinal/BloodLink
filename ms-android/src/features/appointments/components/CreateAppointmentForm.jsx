import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import AppAlertModal from '../../../shared/components/AppAlertModal';
import AppointmentCalendar from './AppointmentCalendar';
import CenterPickerList from './CenterPickerList';
import TimeSlotGrid from './TimeSlotGrid';

const WEEKDAY_LABELS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MONTH_LABELS_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function formatDateLong(date) {
  if (!date) return '';
  return `${WEEKDAY_LABELS_LONG[date.getDay()]}, ${date.getDate()} de ${MONTH_LABELS_LONG[date.getMonth()]}`;
}

function SummaryRow({ icon, label, onEdit }) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={16} color="#D42040" />
      <Text style={styles.summaryText} numberOfLines={1}>
        {label}
      </Text>
      <TouchableOpacity onPress={onEdit} hitSlop={8}>
        <Text style={styles.summaryEdit}>Cambiar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CreateAppointmentForm({
  centers,
  loadingCenters,
  centersError,
  selectedDate,
  setSelectedDate,
  selectedCenter,
  setSelectedCenter,
  selectedTime,
  handleSelectTime,
  resetToDate,
  resetToCenter,
  resetToTime,
  slots,
  loadingSlots,
  slotsError,
  submitting,
  submitError,
  alertInfo,
  clearAlert,
  onSubmit,
}) {
  const stepSubtitle = !selectedDate
    ? 'Elige la fecha que mejor te convenga.'
    : !selectedCenter
    ? 'Elige el centro de donación más cercano.'
    : !selectedTime
    ? 'Elige un horario disponible.'
    : 'Revisa los datos y confirma tu cita.';

  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="calendar" size={30} color="#D42040" />
        <View style={styles.iconBadge}>
          <Ionicons name="add" size={11} color="#FFFFFF" />
        </View>
      </View>

      <Text style={styles.title}>Agenda tu Donación</Text>
      <Text style={styles.subtitle}>{stepSubtitle}</Text>

      {selectedDate ? (
        <SummaryRow icon="calendar-outline" label={formatDateLong(selectedDate)} onEdit={resetToDate} />
      ) : null}
      {selectedCenter ? (
        <SummaryRow icon="business-outline" label={selectedCenter.name} onEdit={resetToCenter} />
      ) : null}
      {selectedTime ? <SummaryRow icon="time-outline" label={selectedTime} onEdit={resetToTime} /> : null}

      <View style={styles.stepWrap}>
        {!selectedDate ? (
          <AppointmentCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        ) : !selectedCenter ? (
          <CenterPickerList
            centers={centers}
            loading={loadingCenters}
            error={centersError}
            selectedCenterId={selectedCenter?.id}
            onSelectCenter={setSelectedCenter}
          />
        ) : !selectedTime ? (
          <TimeSlotGrid
            slots={slots}
            loading={loadingSlots}
            error={slotsError}
            selectedTime={selectedTime}
            onSelectTime={handleSelectTime}
          />
        ) : null}
      </View>

      {submitError ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
          <Text style={styles.errorBannerText}>{submitError}</Text>
        </View>
      ) : null}

      {selectedDate && selectedCenter && selectedTime ? (
        <PrimaryButton label="Confirmar Cita" onPress={onSubmit} loading={submitting} />
      ) : null}

      {selectedDate ? (
        <TouchableOpacity style={styles.cancelBtn} onPress={resetToDate} activeOpacity={0.8}>
          <Ionicons name="close-circle-outline" size={16} color="#DC2626" />
          <Text style={styles.cancelBtnText}>Cancelar Agendación</Text>
        </TouchableOpacity>
      ) : null}

      <AppAlertModal
        visible={!!alertInfo}
        title={alertInfo?.title}
        message={alertInfo?.message}
        onClose={clearAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    elevation: 2,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    marginBottom: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D42040',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    textTransform: 'capitalize',
  },
  summaryEdit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42040',
  },
  stepWrap: {
    marginTop: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  errorBannerText: {
    flex: 1,
    color: '#C62828',
    fontSize: 13,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
