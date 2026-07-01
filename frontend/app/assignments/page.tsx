"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { AssignmentListView } from '@/features/assignments';
import { ProtectedRoute } from '@/utils/route-guards';

export default function AssignmentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Course Assignments"
            description="Manage term assignments, homework files, evaluation rubrics, publish calendars, and maximum grades."
          />
          <ContentArea>
            <AssignmentListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
