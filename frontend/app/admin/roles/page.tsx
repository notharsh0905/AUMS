"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';
import { ProtectedRoute } from '@/utils/route-guards';

export default function AdminRolesPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        icon={Shield}
        title="Roles"
        description="Configure RBAC role definitions and map permissions namespaces."
      />
    </ProtectedRoute>
  );
}
