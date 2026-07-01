"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ProgramListView } from '@/features/programs';
import { ProtectedRoute } from '@/utils/route-guards';

export default function ProgramsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Program Management"
            description="Manage degree offerings, curricular structures, and semester counts."
          />
          <ContentArea>
            <ProgramListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
