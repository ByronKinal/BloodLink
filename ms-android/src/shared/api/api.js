import axios from 'axios';
import * as Device from 'expo-device';
import { useAuthStore } from '../../features/auth/store/authStore';

function resolveBaseUrl(url) {
  if (!url) return url;
  if (!Device.isDevice && url.includes('localhost')) {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
}

const POSTGRES_BASE_URL = resolveBaseUrl(process.env.EXPO_PUBLIC_POSTGRES_API_URL || 'http://localhost:3007');
const MONGO_BASE_URL = resolveBaseUrl(process.env.EXPO_PUBLIC_MONGO_API_URL || 'http://localhost:3006');

function attachAuthInterceptor(instance) {
  instance.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Token invalido o expirado (401): forzar logout. AppNavigator reacciona
  // solo al accessToken volverse null y redirige a Login, sin navegacion manual.
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        useAuthStore.getState().clearSession();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const postgresApi = attachAuthInterceptor(axios.create({ baseURL: POSTGRES_BASE_URL }));
export const mongoApi = attachAuthInterceptor(axios.create({ baseURL: MONGO_BASE_URL }));

