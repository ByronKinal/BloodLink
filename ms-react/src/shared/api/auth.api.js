import { postgresApi } from './api.js'

export const registerUser = (formData) =>
  postgresApi.post('/api/v1/auth/register', formData, {
    headers: { 'Content-Type': undefined },
  })

export const loginUser = (emailOrUsername, password) =>
  postgresApi.post('/api/v1/auth/login', { emailOrUsername, password })

export const verifyEmailByToken = (token) =>
  postgresApi.post('/api/v1/auth/verify-email', { token })

export const verifyEmailByCode = (email, activationCode) =>
  postgresApi.post('/api/v1/auth/verify-email', { email, activationCode: String(activationCode) })

export const resendVerification = (email) =>
  postgresApi.post('/api/v1/auth/resend-verification', { email })

export const forgotPassword = (email) =>
  postgresApi.post('/api/v1/auth/forgot-password', { email })

export const resetPassword = (token, newPassword) =>
  postgresApi.post('/api/v1/auth/reset-password', { token, newPassword })
