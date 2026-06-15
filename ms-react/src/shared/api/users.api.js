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

export const fetchAllowedRoles = () =>
  postgresApi.get('/api/v1/users/allowed-roles', getAuthConfig())

export const fetchUsersByRole = (roleName) =>
  postgresApi.get(`/api/v1/users/by-role/${roleName}`, getAuthConfig())

export const fetchUserRoles = (userId) =>
  postgresApi.get(`/api/v1/users/${userId}/roles`, getAuthConfig())

export const updateUserRole = (userId, roleName) =>
  postgresApi.put(`/api/v1/users/${userId}/role`, { roleName }, getAuthConfig())

export const updateUserByAdmin = (userId, payload) =>
  postgresApi.patch(`/api/v1/users/${userId}`, payload, getAuthConfig())

export const updateUserStatusByAdmin = (userId, status) =>
  postgresApi.patch(`/api/v1/users/${userId}`, { status }, getAuthConfig())

export const createUserByAdmin = (payload) =>
  postgresApi.post('/api/v1/users', payload, getAuthConfig())