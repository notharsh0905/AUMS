export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    REGISTER: '/auth/register',
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  ROLES: {
    BASE: '/roles',
    DETAIL: (id: string) => `/roles/${id}`,
    PERMISSIONS: '/roles/permissions',
  },
} as const;
