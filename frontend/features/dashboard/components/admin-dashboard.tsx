"use client";

import React from 'react';
import { useAdminDashboard } from '../hooks/use-admin-dashboard';
import { StatisticsCard } from './statistics-card';
import { EnrollmentChart } from './enrollment-chart';
import { AttendanceChart } from './attendance-chart';
import { RecentActivity } from './recent-activity';
import { QuickActions } from './quick-actions';
import { NotificationsPanel } from './notifications-panel';
import { UpcomingEvents } from './upcoming-events';
import { SystemStatus } from './system-status';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import {
  QUICK_ACTIONS,
  UPCOMING_EVENTS,
  SYSTEM_STATUSES,
} from '@/constants/dashboard-demo';

export function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        {/* Statistics Cards Section */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
            <div className="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-44 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
            <div className="h-44 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Statistics Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {data.statsCards.map((card) => (
          <StatisticsCard key={card.id} data={card} />
        ))}
      </div>

      {/* 2. Main Analytics & Sidebar Layout Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Main Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <EnrollmentChart data={data.enrollmentTrends} />
          <AttendanceChart data={data.attendanceTrends} />
          <RecentActivity activities={data.recentActivities} />
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-6">
          <QuickActions actions={QUICK_ACTIONS} />
          
          {/* Academic Results Summary Card */}
          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400">Academic Results Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-855 bg-zinc-50/20 dark:bg-zinc-900/5">
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">Course Results</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.resultsSummary.courseCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-855 bg-zinc-50/20 dark:bg-zinc-900/5">
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">Semester SGPA Records</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.resultsSummary.semesterCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-855 bg-zinc-50/20 dark:bg-zinc-900/5">
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">Program CGPA Records</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.resultsSummary.programCount}</span>
              </div>
            </CardContent>
          </Card>

          <NotificationsPanel notifications={data.notifications} />
          <UpcomingEvents events={UPCOMING_EVENTS} />
          <SystemStatus statuses={SYSTEM_STATUSES} />
        </div>
      </div>
    </div>
  );
}
