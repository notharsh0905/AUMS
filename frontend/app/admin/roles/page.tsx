"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { RoleListView } from '@/features/admin-roles';
import { RoleRoute } from '@/utils/route-guards';

export default function AdminRolesPage() {
  return (
    <RoleRoute roles={['SUPER_ADMIN']}>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="Roles & RBAC Policies"
            description="Examine role definitions, operational privilege mappings, and security access policy attributes."
          />
          <ContentArea>
            <RoleListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </RoleRoute>
  );
}
