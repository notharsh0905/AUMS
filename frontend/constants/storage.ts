import { config } from '@/config';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: config.storageKeys.accessToken,
  REFRESH_TOKEN: config.storageKeys.refreshToken,
  THEME: config.storageKeys.theme,
  USER: config.storageKeys.user,
} as const;
