import { postgresApi } from '../../../shared/api/api.js';

export const login = (payload) => postgresApi.post('/api/v1/auth/login', payload);

export const register = (formData) =>
  postgresApi.post('/api/v1/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const verifyEmail = (payload) => postgresApi.post('/api/v1/auth/verify-email', payload);

export const resendVerification = (payload) =>
  postgresApi.post('/api/v1/auth/resend-verification', payload);

export const forgotPassword = (payload) => postgresApi.post('/api/v1/auth/forgot-password', payload);

export const resetPassword = (payload) => postgresApi.post('/api/v1/auth/reset-password', payload);

export const refreshAccessToken = (payload) => postgresApi.post('/api/v1/auth/refresh-token', payload);

export const logout = (payload) => postgresApi.post('/api/v1/auth/logout', payload);
