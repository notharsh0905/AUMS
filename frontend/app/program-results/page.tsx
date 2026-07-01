"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { ProgramResultListView } from '@/features/program-results';
import { ProtectedRoute } from '@/utils/route-guards';

export default function ProgramResultsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Program Results (CGPA)"
            description="Manage student cumulative CGPA scores, graduation checklists, and overall degree certifications."
          />
          <ContentArea>
            <ProgramResultListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
