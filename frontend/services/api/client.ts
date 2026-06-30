import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { HTTP_STATUS } from '@/constants/common';
import { API_ENDPOINTS } from '@/constants/api';
import {
  ApiError,
  ValidationError,
  NetworkError,
  UnauthorizedError,
  ForbiddenError,
  SessionExpiredError,
  InvalidCredentialsError,
} from '@/utils/errors';
import { ApiResponse, ValidationErrorDetail } from '@/types/api';
import { cookies } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants/storage';

// 1. Create Axios Instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 2. Request Interceptor
apiClient.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
    }
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Error Normalization and Concurrent Token Refresh)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      return Promise.reject(new NetworkError(error.message));
    }

    const status = error.response.status;
    const responseData = error.response.data as Record<string, unknown> | null;

    const errorMessage = String(
      responseData?.message || responseData?.error || 'An unexpected error occurred'
    );
    const errorCode = responseData?.code ? String(responseData.code) : undefined;

    // Handle 401 Unauthorized (Token Refresh logic)
    if (status === HTTP_STATUS.UNAUTHORIZED && originalRequest && !originalRequest._retry) {
      // If we are already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      const refreshToken = cookies.get(STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        isRefreshing = true;
        try {
          // Direct POST call to refresh using raw axios to avoid interceptor loop
          const refreshRes = await axios.post<unknown>(
            `${config.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
            {
              refresh_token: refreshToken,
            }
          );

          const refreshResData = refreshRes.data as { data?: { access_token?: string } } | null;
          const newAccessToken = refreshResData?.data?.access_token;

          if (newAccessToken) {
            cookies.set(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
            isRefreshing = false;

            // Resolve all queued requests with the new token
            processQueue(null, newAccessToken);

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          isRefreshing = false;
          // Reject all queued requests
          const sessionErr = new SessionExpiredError('Session expired. Please log in again.');
          processQueue(sessionErr, null);

          console.error('Auto-refresh token request failed:', refreshErr);
          // Clear credentials and broadcast logout
          cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
          cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-logout'));
          }
          return Promise.reject(sessionErr);
        }
      } else {
        // No refresh token available
        cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
        cookies.remove(STORAGE_KEYS.REFRESH_TOKEN);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-logout'));
        }
        return Promise.reject(new SessionExpiredError());
      }
    }

    // Normal error mapping
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        if (
          errorCode === 'INVALID_CREDENTIALS' ||
          errorMessage.toLowerCase().includes('credential')
        ) {
          return Promise.reject(new InvalidCredentialsError(errorMessage, errorCode));
        }
        if (errorCode === 'SESSION_EXPIRED' || errorMessage.toLowerCase().includes('expired')) {
          return Promise.reject(new SessionExpiredError(errorMessage, errorCode));
        }
        return Promise.reject(new UnauthorizedError(errorMessage, errorCode));

      case HTTP_STATUS.FORBIDDEN:
        return Promise.reject(new ForbiddenError(errorMessage, errorCode));

      case HTTP_STATUS.UNPROCESSABLE_ENTITY: {
        const validationErrors = (responseData?.errors as ValidationErrorDetail[]) || [];
        return Promise.reject(new ValidationError(errorMessage, status, errorCode, validationErrors));
      }

      default:
        return Promise.reject(new ApiError(errorMessage, status, errorCode, responseData?.details));
    }
  }
);

// Helper wrappers
export const api = {
  get: <T = unknown>(url: string, conf = {}) =>
    apiClient.get<ApiResponse<T>>(url, conf).then((r) => r.data),
  post: <T = unknown>(url: string, data = {}, conf = {}) =>
    apiClient.post<ApiResponse<T>>(url, data, conf).then((r) => r.data),
  put: <T = unknown>(url: string, data = {}, conf = {}) =>
    apiClient.put<ApiResponse<T>>(url, data, conf).then((r) => r.data),
  patch: <T = unknown>(url: string, data = {}, conf = {}) =>
    apiClient.patch<ApiResponse<T>>(url, data, conf).then((r) => r.data),
  delete: <T = unknown>(url: string, conf = {}) =>
    apiClient.delete<ApiResponse<T>>(url, conf).then((r) => r.data),
};
