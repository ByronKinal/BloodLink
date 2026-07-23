import { useState, useEffect, useCallback } from 'react';
import * as appointmentsApi from '../api/appointments.api';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setError(null);
      const response = await appointmentsApi.getAppointments();
      const data = response.data?.data || response.data || [];
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Error fetching appointments:', err?.message);
      setError('No se pudieron cargar las citas.');
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

  return {
    appointments,
    loading,
    refreshing,
    error,
    refetch: fetchAppointments,
    onRefresh,
  };
}
