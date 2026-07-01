"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { CourseOfferingListView } from '@/features/course-offerings';
import { ProtectedRoute } from '@/utils/route-guards';

export default function CourseOfferingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Course Offerings"
            description="Manage term-specific course iterations, sections, class capacity limits, and term catalog schedules."
          />
          <ContentArea>
            <CourseOfferingListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
