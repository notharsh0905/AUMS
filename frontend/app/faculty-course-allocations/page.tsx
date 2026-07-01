"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { AllocationListView } from '@/features/faculty-course-allocations';
import { ProtectedRoute } from '@/utils/route-guards';

export default function FacultyCourseAllocationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Faculty Course Allocations"
            description="Manage and assign university faculty members to term course offering sections."
          />
          <ContentArea>
            <AllocationListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
