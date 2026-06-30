import { api, apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  CurrentUser,
} from '@/types/auth';
import { DEMO_USERS } from '@/config/demo-users';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    return res.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post<void>(API_ENDPOINTS.AUTH.LOGOUT, { refresh_token: refreshToken });
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<unknown>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });
    const resPayload = response.data as { data: RefreshTokenResponse };
    return resPayload.data;
  },

  getCurrentUser: async (userId?: string): Promise<CurrentUser> => {
    try {
      const res = await api.get<CurrentUser>(API_ENDPOINTS.AUTH.ME);
      return res.data;
    } catch (error) {
      console.warn(
        'Failed to fetch /auth/me from backend, falling back to stub user details:',
        error
      );
      // Default to demo super_admin in development
      if (userId === DEMO_USERS.student.userId) return DEMO_USERS.student;
      if (userId === DEMO_USERS.faculty.userId) return DEMO_USERS.faculty;
      if (userId === DEMO_USERS.parent.userId) return DEMO_USERS.parent;
      return DEMO_USERS.super_admin;
    }
  },
};
