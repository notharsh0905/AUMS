"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { AcademicYearListView } from '@/features/academic-years';
import { ProtectedRoute } from '@/utils/route-guards';

export default function AcademicYearsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Academic Years"
            description="Configure institutional calendar terms, start and end dates, and set the current active academic year."
          />
          <ContentArea>
            <AcademicYearListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
