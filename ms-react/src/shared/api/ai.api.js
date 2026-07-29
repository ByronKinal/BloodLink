import { mongoApi } from './api.js'
import { getStoredAuth } from '../utils/auth.store.js'

function getAuthConfig() {
  const accessToken = getStoredAuth()?.accessToken
  return accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}
}

export const askDonationAssistant = (question) =>
  mongoApi.post('/api/v1/ai/donation-assistant', { question }, getAuthConfig())
