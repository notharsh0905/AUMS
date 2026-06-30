"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, AuthState, LoginRequest } from '@/types/auth';
import { authService } from '@/services/auth/service';
import { tokenStorage } from '@/utils/auth-token';
import { decodeJwt } from '@/utils/jwt';
import * as rbac from '@/utils/rbac';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const login = async (credentials: LoginRequest) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);

      tokenStorage.setAccessToken(response.access_token);
      tokenStorage.setRefreshToken(response.refresh_token);

      const decoded = decodeJwt(response.access_token);
      const userProfile = await authService.getCurrentUser(decoded?.user_id);

      setState({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e: unknown) {
      console.error('Login failed:', e);
      const err = e as Error;
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message || 'Login failed',
      });
      throw e;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      tokenStorage.clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const hasRole = useCallback((role: string): boolean => {
    return rbac.hasRole(state.user, role);
  }, [state.user]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return rbac.hasAnyRole(state.user, roles);
  }, [state.user]);

  const hasPermission = useCallback((permission: string): boolean => {
    return rbac.hasPermission(state.user, permission);
  }, [state.user]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return rbac.hasAnyPermission(state.user, permissions);
  }, [state.user]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return rbac.hasAllPermissions(state.user, permissions);
  }, [state.user]);

  const restoreSession = useCallback(async (): Promise<void> => {
    await Promise.resolve();

    setState((prev) => {
      if (prev.isLoading) return prev;
      return { ...prev, isLoading: true, error: null };
    });

    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const decoded = decodeJwt(accessToken);
      if (!decoded) {
        tokenStorage.clearTokens();
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : true;
      if (isExpired) {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const refreshRes = await authService.refreshToken(refreshToken);
            tokenStorage.setAccessToken(refreshRes.access_token);

            const newDecoded = decodeJwt(refreshRes.access_token);
            const userProfile = await authService.getCurrentUser(newDecoded?.user_id);

            setState({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return;
          } catch (e) {
            console.error('Session restoration token refresh failed:', e);
            tokenStorage.clearTokens();
          }
        } else {
          tokenStorage.clearTokens();
        }
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const userProfile = await authService.getCurrentUser(decoded.user_id);
      setState({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e: unknown) {
      console.error('Session restoration failed:', e);
      const err = e as Error;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Session restoration failed',
      }));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const handleAutoLogout = () => {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired. Please log in again.',
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-logout', handleAutoLogout);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-logout', handleAutoLogout);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
