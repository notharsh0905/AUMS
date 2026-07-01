"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { FacultyListView } from '@/features/faculty';
import { ProtectedRoute } from '@/utils/route-guards';

export default function FacultyPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Faculty Management"
            description="Manage academic directory profiles, departmental assignments, and contract types."
          />
          <ContentArea>
            <FacultyListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
