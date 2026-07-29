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

export const fetchStockSummary = () =>
  mongoApi.get('/api/v1/reports/stock-summary', getAuthConfig())

export const fetchMyStats = () =>
  mongoApi.get('/api/v1/reports/my-stats', getAuthConfig())
