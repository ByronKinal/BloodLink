import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import PrimaryButton from '../../../shared/components/PrimaryButton';

const formatDateLabel = (date) =>
  date
    ? date.toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Selecciona una fecha';

const formatTimeLabel = (time) =>
  time ? time.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }) : 'Selecciona una hora';

export default function CreateAppointmentForm({
  date,
  time,
  showDatePicker,
  showTimePicker,
  setShowDatePicker,
  setShowTimePicker,
  handleChangeDate,
  handleChangeTime,
  submitting,
  submitError,
  onSubmit,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Agenda tu Donación</Text>
      <Text style={styles.subtitle}>Elige la fecha y hora que mejor te convenga</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha *</Text>
        <TouchableOpacity style={styles.pickerField} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={18} color="#64748B" />
          <Text style={[styles.pickerText, !date && styles.pickerPlaceholder]}>{formatDateLabel(date)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hora *</Text>
        <TouchableOpacity style={styles.pickerField} onPress={() => setShowTimePicker(true)}>
          <Ionicons name="time-outline" size={18} color="#64748B" />
          <Text style={[styles.pickerText, !time && styles.pickerPlaceholder]}>{formatTimeLabel(time)}</Text>
        </TouchableOpacity>
      </View>

      {submitError ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
          <Text style={styles.errorBannerText}>{submitError}</Text>
        </View>
      ) : null}

      <PrimaryButton label="Confirmar Cita" onPress={onSubmit} loading={submitting} />

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={handleChangeDate}
        />
      )}

      {showTimePicker && (
        <DateTimePicker value={time || new Date()} mode="time" display="default" onChange={handleChangeTime} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 14,
    color: '#1E293B',
    textTransform: 'capitalize',
  },
  pickerPlaceholder: {
    color: '#94A3B8',
    textTransform: 'none',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorBannerText: {
    flex: 1,
    color: '#C62828',
    fontSize: 13,
  },
});
