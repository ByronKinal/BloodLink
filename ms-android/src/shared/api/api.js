import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../../features/auth/store/authStore';

const rawPostgresUrl = process.env.EXPO_PUBLIC_POSTGRES_API_URL || 'http://localhost:3007';
const rawMongoUrl = process.env.EXPO_PUBLIC_MONGO_API_URL || 'http://localhost:3006';

function formatBaseUrl(url) {
  if (!url) return 'http://10.0.2.2:3006';
  if (Platform.OS === 'android' && url.includes('localhost')) {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
}

const POSTGRES_BASE_URL = formatBaseUrl(rawPostgresUrl);
const MONGO_BASE_URL = formatBaseUrl(rawMongoUrl);

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

