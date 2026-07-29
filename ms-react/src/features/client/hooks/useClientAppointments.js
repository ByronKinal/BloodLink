import { useCallback, useEffect, useState } from 'react'
import { fetchTriageForms } from '../../../shared/api/triage.api.js'
import {
  fetchAppointments,
  createAppointment,
  cancelAppointment as cancelAppointmentApi,
} from '../../../shared/api/appointments.api.js'
import { getStoredAuth } from '../../../shared/utils/auth.store.js'
import { getLatestTriageForm } from '../../../shared/utils/triageLock.js'
import { getTriageFreshnessInfo } from '../../../shared/utils/triageFreshness.js'

function getErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors

  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors.map((item) => item.message ?? item.msg).join(' · ')
  }

  return error?.response?.data?.message || error?.message || 'Ocurrió un error inesperado.'
}

function sortByDateTime(appointments) {
  return [...appointments].sort(
    (a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  )
}

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED']

export function useClientAppointments() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [freshness, setFreshness] = useState({ eligible: false, daysSinceSubmission: null, lastForm: null })
  const [appointments, setAppointments] = useState([])
  const [hasActiveAppointment, setHasActiveAppointment] = useState(false)
  const [creating, setCreating] = useState(false)
  const [cancelingId, setCancelingId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, tone = 'success') => setToast({ message, tone })
  const dismissToast = () => setToast(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const userId = getStoredAuth()?.user?.id
      const [triageRes, appointmentsRes] = await Promise.all([
        fetchTriageForms(userId),
        fetchAppointments(),
      ])

      const lastForm = getLatestTriageForm(triageRes.data?.data ?? [])
      setFreshness(getTriageFreshnessInfo(lastForm))

      const activeAppointments = (appointmentsRes.data?.data ?? []).filter((appointment) =>
        ACTIVE_STATUSES.includes(appointment.status)
      )
      setAppointments(sortByDateTime(activeAppointments))
      setHasActiveAppointment(activeAppointments.length > 0)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const bookAppointment = async (date, time) => {
    setCreating(true)

    try {
      await createAppointment({ date, time })
      showToast('Cita agendada correctamente.', 'success')
      await load()
      return true
    } catch (bookError) {
      showToast(getErrorMessage(bookError), 'error')
      return false
    } finally {
      setCreating(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    setCancelingId(appointmentId)

    try {
      await cancelAppointmentApi(appointmentId)
      setAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId))
      setHasActiveAppointment(false)
      showToast('Cita cancelada.', 'error')
    } catch (cancelError) {
      showToast(getErrorMessage(cancelError), 'error')
    } finally {
      setCancelingId(null)
    }
  }

  return {
    loading,
    error,
    freshness,
    appointments,
    hasActiveAppointment,
    creating,
    cancelingId,
    bookAppointment,
    cancelAppointment,
    refresh: load,
    toast,
    dismissToast,
  }
}
