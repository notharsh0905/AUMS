"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageContainer, PageHeader, ContentArea } from '@/components/layouts/page-container';
import { UserListView } from '@/features/admin-users';
import { RoleRoute } from '@/utils/route-guards';

export default function AdminUsersPage() {
  return (
    <RoleRoute roles={['SUPER_ADMIN']}>
      <DashboardLayout>
        <PageContainer>
          <PageHeader
            title="User Account Directory"
            description="Manage central authentication directory accounts, provision user profiles, and verify credentials."
          />
          <ContentArea>
            <UserListView />
          </ContentArea>
        </PageContainer>
      </DashboardLayout>
    </RoleRoute>
  );
}
