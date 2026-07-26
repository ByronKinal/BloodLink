import { mongoApi, postgresApi } from './api.js'
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

export const fetchMyMedicalProfile = () =>
  mongoApi.get('/api/v1/profiles/me', getAuthConfig())

export const fetchMyStats = () =>
  mongoApi.get('/api/v1/reports/my-stats', getAuthConfig())

export const updateMyProfile = (userId, payload) => {
  const token = getStoredAuth()?.accessToken

  // Si payload contiene profilePicture como un objeto File, usar FormData para multipart/form-data
  if (payload.profilePicture instanceof File) {
    const formData = new FormData()
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        formData.append(key, payload[key])
      }
    })

    return postgresApi.patch(`/api/v1/users/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  return postgresApi.patch(`/api/v1/users/${userId}`, payload, getAuthConfig())
}
