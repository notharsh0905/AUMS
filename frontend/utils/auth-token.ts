import { cookies } from './storage';
import { STORAGE_KEYS } from '@/constants/storage';
import { decodeJwt } from './jwt';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    return cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
  },

  saveAccessToken: (token: string, days = 1): void => {
    cookies.set(STORAGE_KEYS.ACCESS_TOKEN, token, days);
  },

  // Backwards compatibility alias
  setAccessToken: (token: string, days = 1): void => {
    tokenStorage.saveAccessToken(token, days);
  },

  getRefreshToken: (): string | null => {
    return cookies.get(STORAGE_KEYS.REFRESH_TOKEN);
  },

  saveRefreshToken: (token: string, days = 7): void => {
    cookies.set(STORAGE_KEYS.REFRESH_TOKEN, token, days);
  },

  // Backwards compatibility alias
  setRefreshToken: (token: string, days = 7): void => {
    tokenStorage.saveRefreshToken(token, days);
  },

  removeTokens: (): void => {
    cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
    cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Backwards compatibility alias
  clearTokens: (): void => {
    tokenStorage.removeTokens();
  },

  readTokens: () => {
    return {
      accessToken: tokenStorage.getAccessToken(),
      refreshToken: tokenStorage.getRefreshToken(),
    };
  },

  checkAuthentication: (): boolean => {
    const token = tokenStorage.getAccessToken();
    if (!token) return false;
    const decoded = decodeJwt(token);
    if (!decoded) return false;
    return decoded.exp ? decoded.exp * 1000 > Date.now() : false;
  },
};
