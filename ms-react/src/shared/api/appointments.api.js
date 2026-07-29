import { mongoApi } from './api.js'
import { getStoredAuth } from '../utils/auth.store.js'

function getAuthConfig() {
  const accessToken = getStoredAuth()?.accessToken

  if (!accessToken) {
    return {}
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
}

export const fetchAppointments = (params = {}) =>
  mongoApi.get('/api/v1/appointments', { ...getAuthConfig(), params })

export const createAppointment = ({ date, time }) =>
  mongoApi.post('/api/v1/appointments', { date, time }, getAuthConfig())

export const fetchStaffAgenda = (date) =>
  mongoApi.get('/api/v1/appointments/staff', { ...getAuthConfig(), params: { date } })

export const confirmAppointment = (appointmentId, staffUserId) =>
  mongoApi.patch(
    `/api/v1/appointments/${appointmentId}/confirm`,
    { staffUserId },
    getAuthConfig()
  )

export const cancelAppointment = (appointmentId) =>
  mongoApi.patch(`/api/v1/appointments/${appointmentId}/cancel`, {}, getAuthConfig())

export const fetchAvailability = (date) =>
  mongoApi.get('/api/v1/appointments/availability', { ...getAuthConfig(), params: { date } })
