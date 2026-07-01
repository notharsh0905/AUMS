"use client";

import React from 'react';
import { UserCheck } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';
import { ProtectedRoute } from '@/utils/route-guards';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        icon={UserCheck}
        title="Users"
        description="Manage central directory accounts, verify credentials, and track login audits."
      />
    </ProtectedRoute>
  );
}
