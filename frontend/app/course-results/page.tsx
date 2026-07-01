"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { CourseResultListView } from '@/features/course-results';
import { ProtectedRoute } from '@/utils/route-guards';

export default function CourseResultsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Course Results Management"
            description="Manage student final course results, publish academic grades, and monitor overall performance indices."
          />
          <ContentArea>
            <CourseResultListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
