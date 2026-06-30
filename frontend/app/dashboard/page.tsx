"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ProtectedRoute } from '@/utils/route-guards';
import { StatisticsCard } from '@/features/dashboard/components/statistics-card';
import { EnrollmentChart } from '@/features/dashboard/components/enrollment-chart';
import { AttendanceChart } from '@/features/dashboard/components/attendance-chart';
import { QuickActions } from '@/features/dashboard/components/quick-actions';
import { RecentActivity } from '@/features/dashboard/components/recent-activity';
import { NotificationsPanel } from '@/features/dashboard/components/notifications-panel';
import { UpcomingEvents } from '@/features/dashboard/components/upcoming-events';
import { SystemStatus } from '@/features/dashboard/components/system-status';

import {
  STATS_CARDS,
  ENROLLMENT_TRENDS,
  ATTENDANCE_TRENDS,
  QUICK_ACTIONS,
  RECENT_ACTIVITIES,
  NOTIFICATIONS,
  UPCOMING_EVENTS,
  SYSTEM_STATUSES,
} from '@/constants/dashboard-demo';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Dashboard"
            description="Overview of AUMS institutional metrics and system parameters"
          />

          <ContentArea>
            {/* 1. Statistics Cards Section */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {STATS_CARDS.map((card) => (
                <StatisticsCard key={card.id} data={card} />
              ))}
            </div>

            {/* 2. Main Analytics & Sidebar Layout Grid */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Left Main Column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <EnrollmentChart data={ENROLLMENT_TRENDS} />
                <AttendanceChart data={ATTENDANCE_TRENDS} />
                <RecentActivity activities={RECENT_ACTIVITIES} />
              </div>

              {/* Right Sidebar Column */}
              <div className="flex flex-col gap-6">
                <QuickActions actions={QUICK_ACTIONS} />
                <NotificationsPanel notifications={NOTIFICATIONS} />
                <UpcomingEvents events={UPCOMING_EVENTS} />
                <SystemStatus statuses={SYSTEM_STATUSES} />
              </div>
            </div>
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
