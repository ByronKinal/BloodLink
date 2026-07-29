import axios from 'axios'

const isProduction =
  typeof window !== 'undefined' &&
  !window.location.hostname.includes('localhost') &&
  !window.location.hostname.includes('127.0.0.1')

export const POSTGRES_API_URL =
  import.meta.env.VITE_POSTGRES_API_URL ||
  (isProduction
    ? 'https://bloodlink-postgres-service.onrender.com'
    : 'http://localhost:3007')

export const MONGO_API_URL =
  import.meta.env.VITE_MONGO_API_URL ||
  (isProduction
    ? 'https://bloodlink-mongo-service.onrender.com'
    : 'http://localhost:3006')

function createApiClient(baseURL) {
  return axios.create({
    baseURL,
    timeout: 8000,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const postgresApi = createApiClient(POSTGRES_API_URL)

export const mongoApi = createApiClient(MONGO_API_URL)