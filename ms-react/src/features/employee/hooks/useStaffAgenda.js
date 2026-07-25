import { useCallback, useEffect, useState } from 'react'
import { fetchStaffAgenda, confirmAppointment } from '../../../shared/api/appointments.api.js'
import { getStoredAuth } from '../../../shared/utils/auth.store.js'

function todayDateKey() {
  return new Date().toISOString().slice(0, 10)
}

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'No se pudo cargar la agenda.'
}

export function useStaffAgenda() {
  const [selectedDate, setSelectedDate] = useState(todayDateKey)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingId, setConfirmingId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, tone = 'success') => setToast({ message, tone })
  const dismissToast = () => setToast(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchStaffAgenda(selectedDate)
      setAppointments(response.data?.data ?? [])
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    load()
  }, [load])

  const confirmAttendance = async (appointmentId) => {
    setConfirmingId(appointmentId)

    try {
      const staffUserId = getStoredAuth()?.user?.id
      const response = await confirmAppointment(appointmentId, staffUserId)
      const updated = response.data?.data

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, ...updated } : appointment
        )
      )
      showToast('Asistencia confirmada correctamente.', 'success')
    } catch (confirmError) {
      showToast(getErrorMessage(confirmError), 'error')
    } finally {
      setConfirmingId(null)
    }
  }

  return {
    selectedDate,
    setSelectedDate,
    appointments,
    loading,
    error,
    confirmingId,
    confirmAttendance,
    refresh: load,
    toast,
    dismissToast,
  }
}
