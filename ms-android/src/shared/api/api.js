import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';

const POSTGRES_BASE_URL = process.env.EXPO_PUBLIC_POSTGRES_API_URL;
const MONGO_BASE_URL = process.env.EXPO_PUBLIC_MONGO_API_URL;

function attachAuthInterceptor(instance) {
  instance.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  return instance;
}

export const postgresApi = attachAuthInterceptor(axios.create({ baseURL: POSTGRES_BASE_URL }));
export const mongoApi = attachAuthInterceptor(axios.create({ baseURL: MONGO_BASE_URL }));
