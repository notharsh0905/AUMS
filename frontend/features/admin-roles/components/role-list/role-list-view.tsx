"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { useAdminRoles } from '../../hooks/use-roles';
import { AdminRole } from '../../types';
import { RoleDetails } from '../role-details/role-details';

export function RoleListView() {
  const {
    roles,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    search,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedRole,
    triggerView,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useAdminRoles();

  const columns = useMemo<ColumnDef<AdminRole>[]>(
    () => [
      {
        accessorKey: 'roleCode',
        header: 'Role Code',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500" />
            <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
              {row.original.roleCode}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'roleName',
        header: 'Role Name',
        cell: ({ row }) => (
          <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
            {row.original.roleName}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="text-zinc-600 dark:text-zinc-400 text-xs truncate max-w-xs block">
            {row.original.description || 'Standard institutional role.'}
          </span>
        ),
      },
      {
        accessorKey: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Key className="h-3 w-3" />
            <span>{row.original.permissionsCount || 16} policies</span>
          </span>
        ),
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
        searchBar={<SearchBar value={search} onChange={handleSearchChange} placeholder="Search roles..." />}
      />

      <DataTable
        columns={columns}
        data={roles}
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
        title="Role & Permission Policy"
        description="Inspect security policy permissions and access scopes attached to this role."
      >
        {selectedRole ? <RoleDetails role={selectedRole} /> : null}
      </Drawer>
    </div>
  );
}
