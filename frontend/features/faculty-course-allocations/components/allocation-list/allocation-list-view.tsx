"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAllocations } from '../../hooks/use-allocations';
import { FacultyCourseAllocation } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { AllocationForm } from '../allocation-form/allocation-form';
import { AllocationDetails } from '../allocation-details/allocation-details';

export function AllocationListView() {
  const {
    allocations,
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
    selectedAllocation,
    isConfirmOpen,
    setIsConfirmOpen,
    allocationToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createAllocation,
    updateAllocation,
    deleteAllocation,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useAllocations();

  const columns = useMemo<ColumnDef<FacultyCourseAllocation>[]>(
    () => [
      {
        accessorKey: 'facultyName',
        header: 'Faculty Name',
        id: 'facultyName',
      },
      {
        accessorKey: 'employeeId',
        header: 'Employee ID',
        id: 'employeeId',
      },
      {
        accessorKey: 'courseCode',
        header: 'Course Code',
        id: 'courseCode',
      },
      {
        accessorKey: 'courseName',
        header: 'Course Name',
        id: 'courseName',
      },
      {
        accessorKey: 'department',
        header: 'Department',
        id: 'department',
      },
      {
        accessorKey: 'program',
        header: 'Program',
        id: 'program',
      },
      {
        accessorKey: 'academicYear',
        header: 'Academic Year',
        id: 'academicYear',
      },
      {
        accessorKey: 'semester',
        header: 'Semester',
        id: 'semester',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'ACTIVE';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'ACTIVE' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'PLANNED' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
                status === 'COMPLETED' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
                status === 'CANCELLED' &&
                  "bg-red-50 text-red-750 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
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
              aria-label="View allocation details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit allocation"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete allocation"
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
      ? 'Allocate Course to Faculty'
      : drawerMode === 'edit'
        ? 'Edit Faculty Allocation'
        : 'Allocation Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Assign a faculty profile to a course term offering'
      : drawerMode === 'edit'
        ? 'Modify faculty teaching allocations or section assignments'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search faculty, course..."
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
        createLabel="Add Allocation"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={allocations}
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
        {drawerMode === 'view' && selectedAllocation ? (
          <AllocationDetails allocation={selectedAllocation} />
        ) : (
          <AllocationForm
            initialData={selectedAllocation}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createAllocation(values);
              } else if (drawerMode === 'edit' && selectedAllocation) {
                updateAllocation(selectedAllocation.facultyCourseAllocationId, values);
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
          if (allocationToDelete) {
            await deleteAllocation(allocationToDelete.facultyCourseAllocationId);
          }
        }}
        title="Delete Faculty Allocation"
        description={`Are you sure you want to delete the teaching allocation for ${
          allocationToDelete ? allocationToDelete.facultyName : 'this faculty member'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Allocation"
        isLoading={isMutating}
      />
    </div>
  );
}
