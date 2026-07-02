import { api, apiClient } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  CurrentUser,
} from '@/types/auth';
import { DEMO_USERS, DEMO_CREDENTIALS } from '@/config/demo-users';

const b64url = (str: string): string => {
  if (typeof window !== 'undefined') {
    const base64 = btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } else {
    return Buffer.from(str).toString('base64url');
  }
};

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const res = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      return res.data;
    } catch (error) {
      console.warn('Backend login API request failed, attempting demo user fallback:', error);

      const email = data.email.toLowerCase();
      let matchedKey: string | null = null;

      if (email === DEMO_CREDENTIALS.superAdmin.email) matchedKey = 'super_admin';
      else if (email === DEMO_CREDENTIALS.faculty.email) matchedKey = 'faculty';
      else if (email === DEMO_CREDENTIALS.student.email) matchedKey = 'student';
      else if (email === DEMO_CREDENTIALS.parent.email) matchedKey = 'parent';

      if (matchedKey) {
        const demoUser = DEMO_USERS[matchedKey];
        const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = b64url(
          JSON.stringify({
            user_id: demoUser.userId,
            email: demoUser.email,
            exp: Math.floor(Date.now() / 1000) + 3600 * 24, // 24 hours
          })
        );
        const signature = 'mock_signature';
        const mockAccessToken = `${header}.${payload}.${signature}`;

        return {
          access_token: mockAccessToken,
          refresh_token: 'mock_refresh_token',
          token_type: 'Bearer',
          expires_in: 86400,
        };
      }

      throw error;
    }
  },

  logout: async (refreshToken: string): Promise<void> => {
    try {
      await api.post<void>(API_ENDPOINTS.AUTH.LOGOUT, { refresh_token: refreshToken });
    } catch (e) {
      console.warn('Backend logout request failed, logging out client anyway:', e);
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await apiClient.post<unknown>(API_ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken,
      });
      const resPayload = response.data as { data: RefreshTokenResponse };
      return resPayload.data;
    } catch (error) {
      if (refreshToken === 'mock_refresh_token') {
        // Return dummy refresh payload for test user
        return {
          access_token: 'mock_access_token_refreshed',
          token_type: 'Bearer',
          expires_in: 86400,
        };
      }
      throw error;
    }
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
      if (userId === DEMO_USERS.student.userId) return DEMO_USERS.student;
      if (userId === DEMO_USERS.faculty.userId) return DEMO_USERS.faculty;
      if (userId === DEMO_USERS.parent.userId) return DEMO_USERS.parent;
      return DEMO_USERS.super_admin;
    }
  },
};
