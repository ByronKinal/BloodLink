import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as appointmentsApi from '../api/appointments.api';
import * as triageApi from '../../triage/api/triage.api';
import { isTriageApto } from '../../../shared/utils/triageEligibility';
import { getErrorMessage } from '../../../shared/utils/apiError';

const pad = (n) => String(n).padStart(2, '0');
const formatDateForApi = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const formatTimeForApi = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function useCreateAppointment({ onCreated } = {}) {
  const [loadingEligibility, setLoadingEligibility] = useState(true);
  const [hasTriage, setHasTriage] = useState(false);
  const [isApto, setIsApto] = useState(false);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fetchEligibility = useCallback(async () => {
    setLoadingEligibility(true);
    try {
      const history = await triageApi.getTriageHistory();
      const latest = Array.isArray(history) ? history[0] : history;
      setHasTriage(Boolean(latest));
      setIsApto(isTriageApto(latest));
    } catch (err) {
      console.log('Error checking triage eligibility:', err?.message);
      setHasTriage(false);
      setIsApto(false);
    } finally {
      setLoadingEligibility(false);
    }
  }, []);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  const handleChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
      setSubmitError(null);
    }
  };

  const handleChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      setTime(selectedTime);
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    if (!date || !time) {
      Alert.alert('Datos incompletos', 'Selecciona una fecha y una hora para tu cita.');
      return;
    }

    const scheduledAt = new Date(date);
    scheduledAt.setHours(time.getHours(), time.getMinutes(), 0, 0);

    if (scheduledAt.getTime() <= Date.now()) {
      Alert.alert('Fecha inválida', 'La cita debe programarse en una fecha y hora futura.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await appointmentsApi.createAppointment({
        date: formatDateForApi(date),
        time: formatTimeForApi(time),
      });
      Alert.alert('Cita agendada', 'Tu cita de donación fue registrada. Queda pendiente de confirmación.');
      setDate(null);
      setTime(null);
      onCreated?.(created);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'No se pudo agendar la cita.'));
      if (err?.response?.status === 409) {
        setTime(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loadingEligibility,
    hasTriage,
    isApto,
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
    handleSubmit,
    refetchEligibility: fetchEligibility,
  };
}
