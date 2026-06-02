import axios from 'axios'
import { getJwtToken } from '../lib/jwt-token.js'

export function createApiClient(baseURL) {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  apiClient.interceptors.request.use((config) => {
    const token = getJwtToken()

    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  return apiClient
}