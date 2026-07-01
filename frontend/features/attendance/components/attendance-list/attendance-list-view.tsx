"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, CheckSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAttendance } from '../../hooks/use-attendance';
import { AttendanceSession } from '../../types';
import { SESSION_STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { AttendanceForm } from '../attendance-form/attendance-form';
import { AttendanceDetails } from '../attendance-details/attendance-details';
import { AttendanceMarkingView } from '../attendance-marking/attendance-marking-view';

export function AttendanceListView() {
  const {
    sessions,
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
    selectedSession,
    isConfirmOpen,
    setIsConfirmOpen,
    sessionToDelete,
    triggerCreate,
    triggerMark,
    triggerView,
    triggerDelete,
    createSession,
    saveMarked,
    deleteSession,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useAttendance();

  const columns = useMemo<ColumnDef<AttendanceSession>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        id: 'date',
      },
      {
        id: 'course',
        header: 'Course',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{row.original.courseCode}</span>
            <span className="text-xs text-zinc-500 truncate max-w-[180px]">{row.original.courseName}</span>
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
        accessorKey: 'semester',
        header: 'Semester',
        id: 'semester',
      },
      {
        accessorKey: 'section',
        header: 'Section',
        id: 'section',
      },
      {
        accessorKey: 'totalStudents',
        header: 'Total Students',
        id: 'totalStudents',
      },
      {
        accessorKey: 'present',
        header: 'Present',
        id: 'present',
      },
      {
        accessorKey: 'absent',
        header: 'Absent',
        id: 'absent',
      },
      {
        id: 'percentage',
        header: 'Percentage',
        cell: ({ row }) => {
          const pct = row.original.percentage;
          return (
            <span
              className={cn(
                "font-semibold",
                pct >= 75 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
              )}
            >
              {pct}%
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'SCHEDULED';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'COMPLETED' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'SCHEDULED' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
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
              aria-label="View session details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerMark(row.original)}
              aria-label="Mark attendance"
            >
              <CheckSquare className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete session"
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
      ? 'Create Class Session'
      : drawerMode === 'mark'
        ? 'Mark Roll Call Attendance'
        : drawerMode === 'view'
          ? 'Class Attendance Details'
          : 'Edit Session';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Initialize a class session schedule to mark student roll calls'
      : drawerMode === 'mark'
        ? 'Set attendance flags for registered students'
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
              label="Status"
              value={filters.status || ''}
              onChange={(val) => handleFilterChange('status', val)}
              options={SESSION_STATUS_OPTIONS}
            />
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Session"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={sessions}
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
        {drawerMode === 'view' && selectedSession && (
          <AttendanceDetails session={selectedSession} />
        )}
        {drawerMode === 'mark' && selectedSession && (
          <AttendanceMarkingView
            session={selectedSession}
            isSubmitting={isMutating}
            onSubmit={(rows) => saveMarked(selectedSession.attendanceSessionId, rows)}
          />
        )}
        {drawerMode === 'create' && (
          <AttendanceForm
            isSubmitting={isMutating}
            onSubmit={createSession}
          />
        )}
      </Drawer>

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (sessionToDelete) {
            await deleteSession(sessionToDelete.attendanceSessionId);
          }
        }}
        title="Delete Attendance Session"
        description="Are you sure you want to delete this class attendance session? This action is irreversible."
        actionType="delete"
        confirmLabel="Delete Session"
        isLoading={isMutating}
      />
    </div>
  );
}
