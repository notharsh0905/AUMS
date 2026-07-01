"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ExamRegistrationListView } from '@/features/exam-registrations';
import { ProtectedRoute } from '@/utils/route-guards';

export default function ExamRegistrationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Exam Registrations & Hall Tickets"
            description="Manage student exam registrations, verify eligibility, and generate official Hall Tickets."
          />
          <ContentArea>
            <ExamRegistrationListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
