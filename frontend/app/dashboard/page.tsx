"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ProtectedRoute } from '@/utils/route-guards';
import { useAuth } from '@/providers/auth-provider';
import { StudentDashboard } from '@/features/dashboard/components/student-dashboard';
import { FacultyDashboard } from '@/features/dashboard/components/faculty-dashboard';
import { AdminDashboard } from '@/features/dashboard/components/admin-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const isStudent = user?.roles?.includes('STUDENT');
  const isFaculty = user?.roles?.includes('FACULTY');

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title={isStudent ? "Student Portal" : isFaculty ? "Faculty Portal" : "Admin Portal"}
            description={
              isStudent
                ? "Your academic timeline, class schedule, and latest achievements"
                : isFaculty
                  ? "Your assigned courses, timetable schedule, and grading workspace"
                  : "AUMS Institutional operational control center, registrations, and metrics"
            }
          />

          <ContentArea>
            {isStudent ? (
              <StudentDashboard />
            ) : isFaculty ? (
              <FacultyDashboard />
            ) : (
              <AdminDashboard />
            )}
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
