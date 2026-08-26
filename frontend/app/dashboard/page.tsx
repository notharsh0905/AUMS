"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ProtectedRoute } from '@/utils/route-guards';
import { useAuth } from '@/providers/auth-provider';
import { StudentDashboard } from '@/features/dashboard/components/student-dashboard';
import { FacultyDashboard } from '@/features/dashboard/components/faculty-dashboard';
import { AdminDashboard } from '@/features/dashboard/components/admin-dashboard';
import { ParentDashboard } from '@/features/dashboard/components/parent-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const isStudent = user?.roles?.includes('STUDENT');
  const isFaculty = user?.roles?.includes('FACULTY');
  const isParent = user?.roles?.includes('PARENT');

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title={
              isStudent
                ? "Student Portal"
                : isFaculty
                  ? "Faculty Portal"
                  : isParent
                    ? "Parent Portal"
                    : "Admin Portal"
            }
            description={
              isStudent
                ? "Your academic timeline, class schedule, and latest achievements"
                : isFaculty
                  ? "Your assigned courses, timetable schedule, and grading workspace"
                  : isParent
                    ? "Overview of your child's academic standing, progress, and achievements"
                    : "AUMS Institutional operational control center, registrations, and metrics"
            }
          />

          <ContentArea>
            {isStudent ? (
              <StudentDashboard />
            ) : isFaculty ? (
              <FacultyDashboard />
            ) : isParent ? (
              <ParentDashboard />
            ) : (
              <AdminDashboard />
            )}
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
