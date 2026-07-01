"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ExamRoomListView } from '@/features/exam-rooms';
import { ProtectedRoute } from '@/utils/route-guards';

export default function ExamRoomsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Exam Room Management"
            description="Configure examination halls, buildings, seating capacities, and room schedules."
          />
          <ContentArea>
            <ExamRoomListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
