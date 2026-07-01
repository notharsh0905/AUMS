"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ExamAttemptListView } from '@/features/exam-attempts';
import { ProtectedRoute } from '@/utils/route-guards';

export default function ExamAttemptsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Marks Entry & Evaluations"
            description="Record and update student examination marks, review pass/fail statistics, and manage evaluator allocations."
          />
          <ContentArea>
            <ExamAttemptListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
