"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { DepartmentListView } from '@/features/departments';
import { ProtectedRoute } from '@/utils/route-guards';

export default function DepartmentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Department Management"
            description="Configure academic schools, departmental code descriptors, and staff scopes."
          />
          <ContentArea>
            <DepartmentListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
