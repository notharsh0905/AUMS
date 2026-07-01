"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { AttendanceListView } from '@/features/attendance';
import { ProtectedRoute } from '@/utils/route-guards';

export default function AttendancePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Class Attendance Roll Calls"
            description="Manage daily class session markings, student presence ratios, late check-ins, and excuse records."
          />
          <ContentArea>
            <AttendanceListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
