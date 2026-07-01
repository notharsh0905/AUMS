"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ExaminationListView } from '@/features/examinations';
import { ProtectedRoute } from '@/utils/route-guards';

export default function ExaminationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Examinations Schedules"
            description="Manage midterm, practical, and end-term exam timetables, room assignments, grading scales, and duration details."
          />
          <ContentArea>
            <ExaminationListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
