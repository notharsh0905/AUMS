"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { PermissionListView } from '@/features/admin-permissions';
import { RoleRoute } from '@/utils/route-guards';

export default function AdminPermissionsPage() {
  return (
    <RoleRoute roles={['SUPER_ADMIN']}>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="System Permissions & Security Policies"
            description="Examine granular permission namespaces, system authorization scopes, and security policy checks."
          />
          <ContentArea>
            <PermissionListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </RoleRoute>
  );
}
