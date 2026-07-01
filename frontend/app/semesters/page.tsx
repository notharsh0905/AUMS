"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { SemesterListView } from '@/features/semesters';
import { ProtectedRoute } from '@/utils/route-guards';

export default function SemestersPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Semesters"
            description="Manage university term listings, schedules, start and end dates, and academic year assignments."
          />
          <ContentArea>
            <SemesterListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
