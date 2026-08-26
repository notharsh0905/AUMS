"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { useCampuses } from '../../hooks/use-campuses';
import { Campus } from '../../types';
import { CampusForm } from '../campus-form/campus-form';
import { CampusDetails } from '../campus-details/campus-details';

export function CampusListView() {
  const {
    campuses,
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
    selectedCampus,
    triggerCreate,
    triggerView,
    createCampus,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = useCampuses();

  const columns = useMemo<ColumnDef<Campus>[]>(
    () => [
      {
        accessorKey: 'campusCode',
        header: 'Campus Code',
        cell: ({ row }) => (
          <span className="font-mono font-medium text-xs text-zinc-900 dark:text-zinc-100">
            {row.original.campusCode}
          </span>
        ),
      },
      {
        accessorKey: 'campusName',
        header: 'Campus Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-zinc-400" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{row.original.campusName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'city',
        header: 'Location',
        cell: ({ row }) => (
          <span className="text-zinc-600 dark:text-zinc-400 text-xs">
            {row.original.city ? `${row.original.city}, ${row.original.state || ''}` : 'Main Campus'}
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
        searchBar={<SearchBar value={search} onChange={handleSearchChange} placeholder="Search campuses..." />}
        onCreateClick={triggerCreate}
        createLabel="Add Campus"
      />

      <DataTable
        columns={columns}
        data={campuses}
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
        title={drawerMode === 'create' ? 'Add New Campus' : 'Campus Details'}
        description={
          drawerMode === 'create'
            ? 'Register a new institutional campus location.'
            : 'Inspect campus location, codes, and attributes.'
        }
      >
        {drawerMode === 'create' ? (
          <CampusForm onSubmit={createCampus} onCancel={() => setIsDrawerOpen(false)} isLoading={isMutating} />
        ) : selectedCampus ? (
          <CampusDetails campus={selectedCampus} />
        ) : null}
      </Drawer>
    </div>
  );
}
