"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { TimetableListView } from '@/features/timetable';
import { ProtectedRoute } from '@/utils/route-guards';

export default function TimetablePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Timetable Scheduling"
            description="Manage weekly classroom calendars, hourly slots, day grids, and lecture hall capacities."
          />
          <ContentArea>
            <TimetableListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
