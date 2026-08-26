"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { useSchools } from '../../hooks/use-schools';
import { School } from '../../types';
import { SchoolForm } from '../school-form/school-form';
import { SchoolDetails } from '../school-details/school-details';

export function SchoolListView() {
  const {
    schools,
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
    selectedSchool,
    triggerCreate,
    triggerView,
    createSchool,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useSchools();

  const columns = useMemo<ColumnDef<School>[]>(
    () => [
      {
        accessorKey: 'schoolCode',
        header: 'School Code',
        cell: ({ row }) => (
          <span className="font-mono font-medium text-xs text-zinc-900 dark:text-zinc-100">
            {row.original.schoolCode}
          </span>
        ),
      },
      {
        accessorKey: 'schoolName',
        header: 'School Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{row.original.schoolName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'campusName',
        header: 'Campus',
        cell: ({ row }) => (
          <span className="text-zinc-600 dark:text-zinc-400 text-xs">
            {row.original.campusName || 'Main Campus'}
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
        searchBar={<SearchBar value={search} onChange={handleSearchChange} placeholder="Search schools..." />}
        onCreateClick={triggerCreate}
        createLabel="Add School"
      />

      <DataTable
        columns={columns}
        data={schools}
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
        title={drawerMode === 'create' ? 'Add New School of Study' : 'School Details'}
        description={
          drawerMode === 'create'
            ? 'Establish a new institutional school of study (e.g. Engineering, Medicine).'
            : 'Inspect school details and department groupings.'
        }
      >
        {drawerMode === 'create' ? (
          <SchoolForm onSubmit={createSchool} onCancel={() => setIsDrawerOpen(false)} isLoading={isMutating} />
        ) : selectedSchool ? (
          <SchoolDetails school={selectedSchool} />
        ) : null}
      </Drawer>
    </div>
  );
}
