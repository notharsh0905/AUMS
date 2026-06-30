export interface AppConfig {
  appName: string;
  env: 'development' | 'staging' | 'production' | 'test';
  apiUrl: string;
  apiTimeout: number;
  storageKeys: {
    accessToken: string;
    refreshToken: string;
    theme: string;
    user: string;
  };
  pagination: {
    defaultPage: number;
    defaultLimit: number;
    limitOptions: number[];
  };
  features: {
    enableRegistration: boolean;
    enableNotifications: boolean;
    maintenanceMode: boolean;
  };
}

export const config: AppConfig = {
  appName: 'AUMS',
  env: (process.env.NEXT_PUBLIC_APP_ENV || 'development') as AppConfig['env'],
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  apiTimeout: 15000,
  storageKeys: {
    accessToken: 'aums_access_token',
    refreshToken: 'aums_refresh_token',
    theme: 'aums_theme',
    user: 'aums_user',
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    limitOptions: [10, 20, 50, 100],
  },
  features: {
    enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  },
};
