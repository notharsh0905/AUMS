"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Key } from 'lucide-react';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { Toolbar } from '@/components/shared/toolbar';
import { useAdminPermissions } from '../../hooks/use-permissions';
import { AdminPermission } from '../../types';

export function PermissionListView() {
  const {
    permissions,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    search,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useAdminPermissions();

  const columns = useMemo<ColumnDef<AdminPermission>[]>(
    () => [
      {
        accessorKey: 'permissionCode',
        header: 'Permission Code',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Key className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
              {row.original.permissionCode}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'module',
        header: 'Module Scope',
        cell: ({ row }) => (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {row.original.module}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="text-zinc-600 dark:text-zinc-400 text-xs">
            {row.original.description || `Allows access to perform ${row.original.permissionCode} operations.`}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        searchBar={<SearchBar value={search} onChange={handleSearchChange} placeholder="Search permissions (e.g. students, grades, write)..." />}
      />

      <DataTable
        columns={columns}
        data={permissions}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalCount}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />
    </div>
  );
}
