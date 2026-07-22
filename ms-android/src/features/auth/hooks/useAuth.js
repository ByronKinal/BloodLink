import { useAuthStore } from '../store/authStore.js';
import * as authApi from '../api/auth.api.js';

export function useAuth() {
  const { accessToken, refreshToken, user, isReady, setSession, clearSession } = useAuthStore();

  const signIn = async ({ emailOrUsername, password }) => {
    const response = await authApi.login({ emailOrUsername, password });
    const { accessToken, refreshToken, user } = response.data.data;
    await setSession({ accessToken, refreshToken, user });
  };

  const signOut = async () => {
    try {
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch (error) {
    } finally {
      await clearSession();
    }
  };

  return {
    accessToken,
    user,
    isAuthenticated: Boolean(accessToken),
    isReady,
    signIn,
    signOut,
  };
}
