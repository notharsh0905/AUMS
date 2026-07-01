"use client";

import React from 'react';
import { Settings } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';
import { ProtectedRoute } from '@/utils/route-guards';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <ComingSoon
        icon={Settings}
        title="Settings"
        description="Manage system localization, API configurations, and custom visual controls."
      />
    </ProtectedRoute>
  );
}
