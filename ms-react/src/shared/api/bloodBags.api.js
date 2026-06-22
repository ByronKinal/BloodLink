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

export const fetchBloodBags = () => mongoApi.get('/api/v1/blood-bags', getAuthConfig())
export const createBloodBag = (payload) => mongoApi.post('/api/v1/blood-bags', payload, getAuthConfig())
export const updateBloodBag = (bagId, payload) => mongoApi.put(`/api/v1/blood-bags/${bagId}`, payload, getAuthConfig())
export const deleteBloodBag = (bagId) => mongoApi.delete(`/api/v1/blood-bags/${bagId}`, getAuthConfig())
