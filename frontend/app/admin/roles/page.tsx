"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';
import { RoleRoute } from '@/utils/route-guards';

export default function AdminRolesPage() {
  return (
    <RoleRoute roles={['SUPER_ADMIN']}>
      <ComingSoon
        icon={Shield}
        title="Roles"
        description="Configure RBAC role definitions and map permissions namespaces."
      />
    </RoleRoute>
  );
}
