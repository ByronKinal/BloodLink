import { useAuthStore } from '../store/authStore.js';
import * as authApi from '../api/auth.api.js';

export function useAuth() {
  const { accessToken, refreshToken, user, isReady, setSession, clearSession } = useAuthStore();

  const signIn = async ({ emailOrUsername, password }) => {
    const response = await authApi.login({ emailOrUsername, password });
    const { accessToken, refreshToken, user } = response.data.data;
    await setSession({ accessToken, refreshToken, user });
  };

  const signUp = async (formData) => {
    return await authApi.register(formData);
  };

  const verifyEmail = async (payload) => {
    return await authApi.verifyEmail(payload);
  };

  const resendVerification = async (payload) => {
    return await authApi.resendVerification(payload);
  };

  const forgotPassword = async (payload) => {
    return await authApi.forgotPassword(payload);
  };

  const resetPassword = async (payload) => {
    return await authApi.resetPassword(payload);
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
    signUp,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    signOut,
  };
}
