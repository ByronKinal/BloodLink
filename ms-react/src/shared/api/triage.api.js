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

export const fetchTriageForms = (accountId) =>
  mongoApi.get('/api/v1/triage', {
    ...getAuthConfig(),
    params: { accountId },
  })

export const createTriage = (payload) =>
  mongoApi.post('/api/v1/triage', payload, getAuthConfig())

export const updateTriageStatus = (triageId, status) =>
  mongoApi.patch(`/api/v1/triage/${triageId}/status`, { status }, getAuthConfig())
