"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { SubmissionListView } from '@/features/assignment-submissions';
import { ProtectedRoute } from '@/utils/route-guards';

export default function AssignmentSubmissionsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Assignment Task Submissions"
            description="Manage, review, grade, and evaluate students home task paper uploads and grade allocations."
          />
          <ContentArea>
            <SubmissionListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
