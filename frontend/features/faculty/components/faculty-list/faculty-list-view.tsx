"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFaculty } from '../../hooks/use-faculty';
import { Faculty } from '../../types';
import {
  STATUS_OPTIONS,
  DEPARTMENT_OPTIONS,
  DESIGNATION_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
} from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { FacultyForm } from '../faculty-form/faculty-form';
import { FacultyDetails } from '../faculty-details/faculty-details';

export function FacultyListView() {
  const {
    faculty,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    filters,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedFaculty,
    isConfirmOpen,
    setIsConfirmOpen,
    facultyToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useFaculty();

  const columns = useMemo<ColumnDef<Faculty>[]>(
    () => [
      {
        accessorKey: 'facultyId',
        header: 'Faculty ID',
        id: 'facultyId',
      },
      {
        accessorKey: 'employeeCode',
        header: 'Employee ID',
        id: 'employeeCode',
      },
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        id: 'email',
      },
      {
        accessorKey: 'department',
        header: 'Department',
        id: 'department',
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        id: 'designation',
        cell: ({ row }) => {
          const raw = row.original.designation || '';
          return raw.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        },
      },
      {
        accessorKey: 'employmentType',
        header: 'Type',
        id: 'employmentType',
        cell: ({ row }) => {
          const raw = row.original.employmentType || '';
          return raw.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || '';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'active' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'on_leave' &&
                  "bg-yellow-50 text-yellow-750 ring-yellow-600/10 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20",
                status === 'suspended' &&
                  "bg-red-50 text-red-750 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
                (status === 'retired' || status === 'resigned') &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20"
              )}
            >
              {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerView(row.original)}
              aria-label="View faculty details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit faculty profile"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete faculty record"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const drawerTitle =
    drawerMode === 'create'
      ? 'Add New Faculty'
      : drawerMode === 'edit'
        ? 'Edit Faculty Profile'
        : 'Faculty Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Fill in the information to register a new faculty member'
      : drawerMode === 'edit'
        ? 'Update designated department or personal attributes'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name, employee ID, email..."
          />
        }
        filters={
          <div className="flex items-center gap-3">
            <SelectFilter
              label="Status"
              value={filters.status || ''}
              onChange={(val) => handleFilterChange('status', val)}
              options={STATUS_OPTIONS}
            />
            <SelectFilter
              label="Department"
              value={filters.department || ''}
              onChange={(val) => handleFilterChange('department', val)}
              options={DEPARTMENT_OPTIONS}
            />
            <SelectFilter
              label="Designation"
              value={filters.designation || ''}
              onChange={(val) => handleFilterChange('designation', val)}
              options={DESIGNATION_OPTIONS}
            />
            <SelectFilter
              label="Employment Type"
              value={filters.employmentType || ''}
              onChange={(val) => handleFilterChange('employmentType', val)}
              options={EMPLOYMENT_TYPE_OPTIONS}
            />
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Faculty"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={faculty}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalCount}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerTitle}
        description={drawerDescription}
        size="lg"
      >
        {drawerMode === 'view' && selectedFaculty ? (
          <FacultyDetails faculty={selectedFaculty} />
        ) : (
          <FacultyForm
            initialData={selectedFaculty}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createFaculty(values);
              } else if (drawerMode === 'edit' && selectedFaculty) {
                updateFaculty(selectedFaculty.facultyId, values);
              }
            }}
          />
        )}
      </Drawer>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (facultyToDelete) {
            await deleteFaculty(facultyToDelete.facultyId);
          }
        }}
        title="Delete Faculty Record"
        description={`Are you sure you want to delete ${
          facultyToDelete ? `${facultyToDelete.firstName} ${facultyToDelete.lastName}` : 'this member'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Record"
        isLoading={isMutating}
      />
    </div>
  );
}
