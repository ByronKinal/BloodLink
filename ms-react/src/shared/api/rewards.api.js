import { postgresApi } from './api.js'
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

export const fetchAllRewards = () =>
  postgresApi.get('/api/v1/rewards', getAuthConfig())

export const fetchWalletById = (userId) =>
  postgresApi.get(`/api/v1/wallet/${userId}`, getAuthConfig())

export const redeemReward = ({ rewardId, quantity }) =>
  postgresApi.post(
    '/api/v1/rewards/redeem',
    { rewardId, quantity },
    getAuthConfig(),
  )

export const createReward = (payload) => {
  const authConfig = getAuthConfig()
  return postgresApi.post('/api/v1/rewards', payload, {
    ...authConfig,
    headers: {
      ...authConfig.headers,
      'Content-Type': undefined,
    },
  })
}

export const updateReward = (rewardId, payload) => {
  const authConfig = getAuthConfig()
  return postgresApi.patch(`/api/v1/rewards/${rewardId}`, payload, {
    ...authConfig,
    headers: {
      ...authConfig.headers,
      'Content-Type': undefined,
    },
  })
}

export const deleteReward = (rewardId) =>
  postgresApi.delete(`/api/v1/rewards/${rewardId}`, getAuthConfig())
