"use client";

import React from 'react';
import { Key } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';
import { RoleRoute } from '@/utils/route-guards';

export default function AdminPermissionsPage() {
  return (
    <RoleRoute roles={['SUPER_ADMIN']}>
      <ComingSoon
        icon={Key}
        title="Permissions"
        description="Examine fine-grained application permission checks and policy attributes."
      />
    </RoleRoute>
  );
}
