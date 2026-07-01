"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { RegistrationListView } from '@/features/student-course-registrations';
import { ProtectedRoute } from '@/utils/route-guards';

export default function StudentCourseRegistrationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Student Course Registrations"
            description="Manage and register students for active catalog course section offerings."
          />
          <ContentArea>
            <RegistrationListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
