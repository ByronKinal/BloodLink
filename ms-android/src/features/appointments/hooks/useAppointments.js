import { useState, useEffect, useCallback } from 'react';
import * as appointmentsApi from '../api/appointments.api';
import { getErrorMessage } from '../../../shared/utils/apiError';

/**
 * Hook para la gestión de estado y operaciones del módulo de Citas de Donación.
 */
export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      setError(null);
      const data = await appointmentsApi.getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Error fetching appointments:', err?.message);
      setError(getErrorMessage(err, 'No se pudieron cargar las citas de donación.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCreateAppointment = async (appointmentData) => {
    setActionLoading(true);
    try {
      const newAppointment = await appointmentsApi.createAppointment(appointmentData);
      await fetchAppointments();
      return { success: true, data: newAppointment };
    } catch (err) {
      console.log('Error creating appointment:', err?.message);
      return { success: false, error: getErrorMessage(err, 'No se pudo programar la cita.') };
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    setActionLoading(true);
    try {
      await appointmentsApi.cancelAppointment(appointmentId);
      await fetchAppointments();
      return { success: true };
    } catch (err) {
      console.log('Error canceling appointment:', err?.message);
      return { success: false, error: getErrorMessage(err, 'No se pudo cancelar la cita.') };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    appointments,
    loading,
    refreshing,
    error,
    actionLoading,
    refetch: fetchAppointments,
    onRefresh,
    createAppointment: handleCreateAppointment,
    cancelAppointment: handleCancelAppointment,
  };
}
