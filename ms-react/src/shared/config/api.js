export const POSTGRES_API_URL =
  import.meta.env.VITE_POSTGRES_API_URL ?? 'http://localhost:3007'

export const MONGO_API_URL =
  import.meta.env.VITE_MONGO_API_URL ?? 'http://localhost:3006'

export const JWT_STORAGE_KEY = 'bloodlink_jwt_token'