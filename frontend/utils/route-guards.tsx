"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { ROUTES } from '@/constants/routes';

interface GuardProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD.HOME);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function RoleRoute({ children, roles }: GuardProps & { roles: string[] }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  const isAuthorized = roles.some((role) => hasRole(role));

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.AUTH.LOGIN);
      } else if (!isAuthorized) {
        router.push(ROUTES.DASHBOARD.HOME);
      }
    }
  }, [isAuthenticated, isLoading, isAuthorized, router]);

  if (isLoading || !isAuthenticated || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export function PermissionRoute({ children, permissions }: GuardProps & { permissions: string[] }) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const router = useRouter();

  const isAuthorized = permissions.every((permission) => hasPermission(permission));

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.AUTH.LOGIN);
      } else if (!isAuthorized) {
        router.push(ROUTES.DASHBOARD.HOME);
      }
    }
  }, [isAuthenticated, isLoading, isAuthorized, router]);

  if (isLoading || !isAuthenticated || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

