import { MONGO_API_URL } from '../config/api.js'
import { createApiClient } from './createApiClient.js'

export const mongoApi = createApiClient(MONGO_API_URL)