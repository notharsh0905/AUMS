"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { CourseListView } from '@/features/courses';
import { ProtectedRoute } from '@/utils/route-guards';

export default function CoursesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Course Catalog"
            description="Manage university course listings, contact hours, program curriculum maps, and credit structures."
          />
          <ContentArea>
            <CourseListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
