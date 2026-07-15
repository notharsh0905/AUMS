"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ProtectedRoute } from '@/utils/route-guards';
import { useAuth } from '@/providers/auth-provider';
import { StudentDashboard } from '@/features/dashboard/components/student-dashboard';
import { FacultyDashboard } from '@/features/dashboard/components/faculty-dashboard';
import { AdminDashboard } from '@/features/dashboard/components/admin-dashboard';

export function ParentDashboardPlaceholder() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">Welcome to the Parent Portal</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Access your child&apos;s academic schedule, grades tracking, attendance monitors, and institutional announcements.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Child&apos;s Attendance</h3>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">92%</div>
            <span className="text-[10px] text-green-600 font-semibold">Consistent attendance</span>
          </div>
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current CGPA</h3>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">3.8 / 4.0</div>
            <span className="text-[10px] text-zinc-500 font-semibold">Academic standing: Good</span>
          </div>
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Term</h3>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Semester 2</div>
            <span className="text-[10px] text-zinc-500 font-semibold">Academic Year 2026-2027</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
                    ? "Overview of your child's academic standing, progress and achievements"
                    : "AUMS Institutional operational control center, registrations, and metrics"
            }
          />

          <ContentArea>
            {isStudent ? (
              <StudentDashboard />
            ) : isFaculty ? (
              <FacultyDashboard />
            ) : isParent ? (
              <ParentDashboardPlaceholder />
            ) : (
              <AdminDashboard />
            )}
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
