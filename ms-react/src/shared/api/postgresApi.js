import { POSTGRES_API_URL } from '../config/api.js'
import { createApiClient } from './createApiClient.js'

export const postgresApi = createApiClient(POSTGRES_API_URL)