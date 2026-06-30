"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader } from '@/components/layouts/page-container';
import { ProtectedRoute } from '@/utils/route-guards';
import { RequirePermission } from '@/components/shared/rbac';
import { StudentListView } from '@/features/students/components/student-list-view';

export default function StudentsPage() {
  return (
    <ProtectedRoute>
      <RequirePermission permissions={['students.read']}>
        <DashboardLayout>
          <PageContainer>
            <PageHeader
              title="Students"
              description="Manage registered students, programs, and enrollment states"
            />
            <StudentListView />
          </PageContainer>
        </DashboardLayout>
      </RequirePermission>
    </ProtectedRoute>
  );
}
