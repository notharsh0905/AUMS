"use client";

import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Unauthorized } from './unauthorized';

interface RequireRoleProps {
  roles: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequireRole({ roles, fallback, children }: RequireRoleProps) {
  const { hasAnyRole, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const isAuthorized = hasAnyRole(roles);

  if (!isAuthorized) {
    return fallback !== undefined ? <>{fallback}</> : <Unauthorized />;
  }

  return <>{children}</>;
}

interface RequirePermissionProps {
  permissions: string[];
  mode?: 'any' | 'all';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RequirePermission({
  permissions,
  mode = 'all',
  fallback,
  children,
}: RequirePermissionProps) {
  const { hasAnyPermission, hasAllPermissions, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const isAuthorized =
    mode === 'any' ? hasAnyPermission(permissions) : hasAllPermissions(permissions);

  if (!isAuthorized) {
    return fallback !== undefined ? <>{fallback}</> : <Unauthorized />;
  }

  return <>{children}</>;
}
