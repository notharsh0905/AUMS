"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTimetable } from '../../hooks/use-timetable';
import { TimetableSlot } from '../../types';
import { DAY_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { TimetableForm } from '../timetable-form/timetable-form';
import { TimetableDetails } from '../timetable-details/timetable-details';

export function TimetableListView() {
  const {
    slots,
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
    selectedSlot,
    isConfirmOpen,
    setIsConfirmOpen,
    slotToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createSlot,
    updateSlot,
    deleteSlot,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useTimetable();

  const columns = useMemo<ColumnDef<TimetableSlot>[]>(
    () => [
      {
        id: 'course',
        header: 'Course',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{row.original.courseCode}</span>
            <span className="text-xs text-zinc-500 truncate max-w-[200px]">{row.original.courseName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'facultyName',
        header: 'Faculty',
        id: 'facultyName',
      },
      {
        accessorKey: 'program',
        header: 'Program',
        id: 'program',
      },
      {
        accessorKey: 'department',
        header: 'Department',
        id: 'department',
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
        accessorKey: 'dayOfWeek',
        header: 'Day',
        id: 'dayOfWeek',
        cell: ({ row }) => {
          const day = row.original.dayOfWeek || 'MONDAY';
          return <span>{day.charAt(0) + day.slice(1).toLowerCase()}</span>;
        },
      },
      {
        id: 'time',
        header: 'Time',
        cell: ({ row }) => (
          <span>
            {row.original.startTime} - {row.original.endTime}
          </span>
        ),
      },
      {
        id: 'classroom',
        header: 'Classroom',
        cell: ({ row }) => (
          <span>
            {row.original.classroom} ({row.original.building})
          </span>
        ),
      },
      {
        accessorKey: 'section',
        header: 'Section',
        id: 'section',
      },
      {
        accessorKey: 'maxCapacity',
        header: 'Capacity',
        id: 'maxCapacity',
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
              aria-label="View slot details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit slot"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete slot"
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
      ? 'Create Timetable Slot'
      : drawerMode === 'edit'
        ? 'Edit Timetable Slot'
        : 'Slot Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Schedule a course offering section for a specific time and room slot'
      : drawerMode === 'edit'
        ? 'Modify room allocations, slot times, or day assignments'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search course, code, faculty..."
          />
        }
        filters={
          <div className="flex items-center gap-3">
            <SelectFilter
              label="Day"
              value={filters.dayOfWeek || ''}
              onChange={(val) => handleFilterChange('dayOfWeek', val)}
              options={DAY_OPTIONS}
            />
            <SelectFilter
              label="Status"
              value={filters.status || ''}
              onChange={(val) => handleFilterChange('status', val)}
              options={STATUS_OPTIONS}
            />
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Slot"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={slots}
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
        {drawerMode === 'view' && selectedSlot ? (
          <TimetableDetails slot={selectedSlot} />
        ) : (
          <TimetableForm
            initialData={selectedSlot}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createSlot(values);
              } else if (drawerMode === 'edit' && selectedSlot) {
                updateSlot(selectedSlot.timetableSlotId, values);
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
          if (slotToDelete) {
            await deleteSlot(slotToDelete.timetableSlotId);
          }
        }}
        title="Delete Timetable Slot"
        description="Are you sure you want to delete this scheduled slot? This action is irreversible."
        actionType="delete"
        confirmLabel="Delete Slot"
        isLoading={isMutating}
      />
    </div>
  );
}
