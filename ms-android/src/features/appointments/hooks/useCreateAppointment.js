import { useState, useEffect, useCallback } from 'react';
import * as appointmentsApi from '../api/appointments.api';
import * as triageApi from '../../triage/api/triage.api';
import { useDonationCenters } from '../../centers/hooks/useDonationCenters';
import { isTriageApto } from '../../../shared/utils/triageEligibility';
import { getErrorMessage } from '../../../shared/utils/apiError';

const pad = (n) => String(n).padStart(2, '0');
const formatDateForApi = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function useCreateAppointment({ onCreated } = {}) {
  const [loadingEligibility, setLoadingEligibility] = useState(true);
  const [hasTriage, setHasTriage] = useState(false);
  const [isApto, setIsApto] = useState(false);

  const { centers, loading: loadingCenters, error: centersError } = useDonationCenters();

  const [selectedDate, setSelectedDateState] = useState(null);
  const [selectedCenter, setSelectedCenterState] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);

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

  const setSelectedDate = (date) => {
    setSelectedDateState(date);
    setSelectedCenterState(null);
    setSelectedTime(null);
    setSubmitError(null);
  };

  const setSelectedCenter = (center) => {
    setSelectedCenterState(center);
    setSelectedTime(null);
    setSubmitError(null);
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    setSubmitError(null);
  };

  const resetToDate = () => {
    setSelectedDateState(null);
    setSelectedCenterState(null);
    setSelectedTime(null);
  };

  const resetToCenter = () => {
    setSelectedCenterState(null);
    setSelectedTime(null);
  };

  const resetToTime = () => {
    setSelectedTime(null);
  };

  useEffect(() => {
    if (!selectedDate || !selectedCenter) {
      setSlots([]);
      return undefined;
    }

    let cancelled = false;

    (async () => {
      setLoadingSlots(true);
      setSlotsError(null);
      try {
        const dateStr = formatDateForApi(selectedDate);
        const data = await appointmentsApi.getAvailability(dateStr, selectedCenter.id);
        if (!cancelled) {
          setSlots(Array.isArray(data?.slots) ? data.slots : []);
        }
      } catch (err) {
        console.log('Error fetching availability:', err?.message);
        if (!cancelled) {
          setSlotsError(getErrorMessage(err, 'No se pudo obtener la disponibilidad.'));
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, selectedCenter]);

  const clearAlert = () => setAlertInfo(null);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedCenter || !selectedTime) {
      setAlertInfo({ title: 'Datos incompletos', message: 'Selecciona fecha, centro y hora para tu cita.' });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await appointmentsApi.createAppointment({
        date: formatDateForApi(selectedDate),
        time: selectedTime,
        donationCenterId: selectedCenter.id,
      });
      setAlertInfo({
        title: 'Cita agendada',
        message: 'Tu cita de donación fue registrada. Queda pendiente de confirmación.',
      });
      setSelectedDateState(null);
      setSelectedCenterState(null);
      setSelectedTime(null);
      onCreated?.(created);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'No se pudo agendar la cita.'));
      if (err?.response?.status === 409) {
        setSelectedTime(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loadingEligibility,
    hasTriage,
    isApto,
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
    handleSubmit,
    refetchEligibility: fetchEligibility,
  };
}
