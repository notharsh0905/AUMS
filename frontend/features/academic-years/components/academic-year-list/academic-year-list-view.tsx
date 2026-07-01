"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAcademicYears } from '../../hooks/use-academic-years';
import { AcademicYear } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { AcademicYearForm } from '../academic-year-form/academic-year-form';
import { AcademicYearDetails } from '../academic-year-details/academic-year-details';

export function AcademicYearListView() {
  const {
    academicYears,
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
    selectedAcademicYear,
    isConfirmOpen,
    setIsConfirmOpen,
    academicYearToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useAcademicYears();

  const columns = useMemo<ColumnDef<AcademicYear>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        id: 'code',
      },
      {
        accessorKey: 'academicYearName',
        header: 'Academic Year',
        id: 'academicYearName',
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        id: 'startDate',
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        id: 'endDate',
      },
      {
        accessorKey: 'isCurrent',
        header: 'Current',
        id: 'isCurrent',
        cell: ({ row }) => (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
              row.original.isCurrent
                ? "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
                : "bg-zinc-50 text-zinc-400 ring-zinc-550/10 dark:bg-zinc-900 dark:text-zinc-500"
            )}
          >
            {row.original.isCurrent ? 'Current' : 'No'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'active';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'active' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'inactive' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
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
              aria-label="View academic year details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit academic year"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete academic year"
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
      ? 'Add New Academic Year'
      : drawerMode === 'edit'
        ? 'Edit Academic Year'
        : 'Academic Year Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Register a new institutional academic calendar year'
      : drawerMode === 'edit'
        ? 'Update academic year schedule, dates, or active status'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name, code..."
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
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Academic Year"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={academicYears}
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
        {drawerMode === 'view' && selectedAcademicYear ? (
          <AcademicYearDetails academicYear={selectedAcademicYear} />
        ) : (
          <AcademicYearForm
            initialData={selectedAcademicYear}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createAcademicYear(values);
              } else if (drawerMode === 'edit' && selectedAcademicYear) {
                updateAcademicYear(selectedAcademicYear.academicYearId, values);
              }
            }}
          />
        )}
      </Drawer>

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (academicYearToDelete) {
            await deleteAcademicYear(academicYearToDelete.academicYearId);
          }
        }}
        title="Delete Academic Year"
        description={`Are you sure you want to delete ${
          academicYearToDelete ? academicYearToDelete.academicYearName : 'this academic year'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Academic Year"
        isLoading={isMutating}
      />
    </div>
  );
}
