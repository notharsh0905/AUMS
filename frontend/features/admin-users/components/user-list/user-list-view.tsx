"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAdminUsers } from '../../hooks/use-users';
import { AdminUser } from '../../types';
import { UserForm } from '../user-form/user-form';
import { UserDetails } from '../user-details/user-details';

export function UserListView() {
  const {
    users,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedUser,
    triggerCreate,
    triggerView,
    createUser,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useAdminUsers();

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {row.original.firstName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{row.original.username}</span>
              <span className="text-[11px] text-zinc-400">{row.original.email}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Full Name',
        cell: ({ row }) => (
          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
            {row.original.firstName} {row.original.lastName}
          </span>
        ),
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone',
        cell: ({ row }) => (
          <span className="text-zinc-600 dark:text-zinc-400 text-xs font-mono">
            {row.original.phoneNumber || '—'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => triggerView(row.original)}
              className="h-8 px-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [triggerView]
  );

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        searchBar={<SearchBar value={search} onChange={handleSearchChange} placeholder="Search users by name, username or email..." />}
        onCreateClick={triggerCreate}
        createLabel="Create User"
      />

      <DataTable
        columns={columns}
        data={users}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalCount}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerMode === 'create' ? 'Create User Account' : 'User Account Details'}
        description={
          drawerMode === 'create'
            ? 'Provision a new central identity account for faculty, student, or administrative personnel.'
            : 'Inspect identity account credentials, status, and verification state.'
        }
      >
        {drawerMode === 'create' ? (
          <UserForm onSubmit={createUser} onCancel={() => setIsDrawerOpen(false)} isLoading={isMutating} />
        ) : selectedUser ? (
          <UserDetails user={selectedUser} />
        ) : null}
      </Drawer>
    </div>
  );
}
