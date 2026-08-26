"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { CampusListView } from '@/features/campuses';
import { ProtectedRoute } from '@/utils/route-guards';
import { RequirePermission } from '@/components/shared/rbac';

export default function CampusesPage() {
  return (
    <ProtectedRoute>
      <RequirePermission permissions={['campuses.read']}>
        <DashboardLayout>
          <PageContainer>
            <PageHeader
              title="Campuses"
              description="Manage physical institutional campuses, geographical locations, and master zones."
            />
            <ContentArea>
              <CampusListView />
            </ContentArea>
          </PageContainer>
        </DashboardLayout>
      </RequirePermission>
    </ProtectedRoute>
  );
}
