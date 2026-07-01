"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { AssessmentListView } from '@/features/internal-assessments';
import { ProtectedRoute } from '@/utils/route-guards';

export default function InternalAssessmentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Internal Assessments"
            description="View, record, modify, and evaluate students continuous internal assessment marks, practical, mid-sem exam marks, and bonus/penalty scores."
          />
          <ContentArea>
            <AssessmentListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
