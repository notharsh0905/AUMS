"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { SchoolListView } from '@/features/schools';
import { ProtectedRoute } from '@/utils/route-guards';
import { RequirePermission } from '@/components/shared/rbac';

export default function SchoolsPage() {
  return (
    <ProtectedRoute>
      <RequirePermission permissions={['schools.read']}>
        <DashboardLayout>
          <PageContainer>
            <PageHeader
              title="Schools of Study"
              description="Manage faculty bodies, academic schools, and foundational discipline groupings."
            />
            <ContentArea>
              <SchoolListView />
            </ContentArea>
          </PageContainer>
        </DashboardLayout>
      </RequirePermission>
    </ProtectedRoute>
  );
}
