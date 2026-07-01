"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { SemesterResultListView } from '@/features/semester-results';
import { ProtectedRoute } from '@/utils/route-guards';

export default function SemesterResultsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Semester Results (SGPA)"
            description="Manage term SGPA computations, credit milestones, and monitor student academic standing progression."
          />
          <ContentArea>
            <SemesterResultListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
