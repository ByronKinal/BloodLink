import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';

const POSTGRES_BASE_URL = 'http://10.0.2.2:3007';
const MONGO_BASE_URL = 'http://10.0.2.2:3006';

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
