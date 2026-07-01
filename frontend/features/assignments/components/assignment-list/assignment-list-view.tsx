"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAssignments } from '../../hooks/use-assignments';
import { Assignment } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { AssignmentForm } from '../assignment-form/assignment-form';
import { AssignmentDetails } from '../assignment-details/assignment-details';

export function AssignmentListView() {
  const {
    assignments,
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
    selectedAssignment,
    isConfirmOpen,
    setIsConfirmOpen,
    assignmentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useAssignments();

  const columns = useMemo<ColumnDef<Assignment>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Assignment',
        id: 'title',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{row.original.title}</span>
            <span className="text-[10px] text-zinc-400 truncate max-w-[200px]">{row.original.description}</span>
          </div>
        ),
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
        accessorKey: 'dueAt',
        header: 'Due Date',
        id: 'dueAt',
      },
      {
        accessorKey: 'totalMarks',
        header: 'Maximum Marks',
        id: 'totalMarks',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'DRAFT';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'PUBLISHED' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'DRAFT' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
                status === 'CLOSED' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20"
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
              aria-label="View assignment details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit assignment"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete assignment"
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
      ? 'Create Assignment Task'
      : drawerMode === 'edit'
        ? 'Edit Assignment Task'
        : 'Assignment Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Publish a new home task, grading weight, or semester project file'
      : drawerMode === 'edit'
        ? 'Modify title descriptions, grading weights, or due calendar dates'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search assignments..."
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
        createLabel="Add Assignment"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={assignments}
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
        {drawerMode === 'view' && selectedAssignment ? (
          <AssignmentDetails assignment={selectedAssignment} />
        ) : (
          <AssignmentForm
            initialData={selectedAssignment}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createAssignment(values);
              } else if (drawerMode === 'edit' && selectedAssignment) {
                updateAssignment(selectedAssignment.assignmentId, values);
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
          if (assignmentToDelete) {
            await deleteAssignment(assignmentToDelete.assignmentId);
          }
        }}
        title="Delete Assignment"
        description={`Are you sure you want to delete "${
          assignmentToDelete ? assignmentToDelete.title : 'this assignment'
        }"? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Assignment"
        isLoading={isMutating}
      />
    </div>
  );
}
