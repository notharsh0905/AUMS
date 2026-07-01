"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubmissions } from '../../hooks/use-submissions';
import { AssignmentSubmission } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { SubmissionForm } from '../submission-form/submission-form';
import { SubmissionDetails } from '../submission-details/submission-details';
import { SubmissionReview } from '../submission-review/submission-review';

export function SubmissionListView() {
  const {
    submissions,
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
    selectedSubmission,
    isConfirmOpen,
    setIsConfirmOpen,
    submissionToDelete,
    triggerCreate,
    triggerGrade,
    triggerView,
    triggerDelete,
    createSubmission,
    gradeSubmission,
    deleteSubmission,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useSubmissions();

  const columns = useMemo<ColumnDef<AssignmentSubmission>[]>(
    () => [
      {
        accessorKey: 'assignmentTitle',
        header: 'Assignment',
        id: 'assignmentTitle',
      },
      {
        accessorKey: 'studentName',
        header: 'Student',
        id: 'studentName',
      },
      {
        accessorKey: 'rollNumber',
        header: 'Roll Number',
        id: 'rollNumber',
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
        accessorKey: 'submittedAt',
        header: 'Submission Date',
        id: 'submittedAt',
      },
      {
        id: 'marks',
        header: 'Marks',
        cell: ({ row }) => {
          const marks = row.original.marksAwarded;
          const max = row.original.maximumMarks;
          return (
            <span>
              {marks !== undefined ? `${marks} / ${max}` : 'Not Graded'}
            </span>
          );
        },
      },
      {
        accessorKey: 'submissionStatus',
        header: 'Status',
        id: 'submissionStatus',
        cell: ({ row }) => {
          const status = row.original.submissionStatus || 'SUBMITTED';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'GRADED' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'SUBMITTED' &&
                  "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
                status === 'LATE' &&
                  "bg-red-50 text-red-750 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
                status === 'PENDING' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </span>
          );
        },
      },
      {
        id: 'late',
        header: 'Late',
        cell: ({ row }) => {
          const late = row.original.isLate;
          return (
            <span
              className={cn(
                "font-semibold",
                late ? "text-red-700 dark:text-red-400" : "text-emerald-755 dark:text-emerald-400"
              )}
            >
              {late ? 'Yes' : 'No'}
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
              aria-label="View submission details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerGrade(row.original)}
              aria-label="Grade submission"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete submission"
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
      ? 'Register Student Submission'
      : drawerMode === 'grade'
        ? 'Review & Grade Task Submission'
        : 'Submission Detail View';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Record a student task upload or submission instance'
      : drawerMode === 'grade'
        ? 'Award grading marks and feedback'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search student, roll number..."
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
        createLabel="Add Submission"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={submissions}
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
        {drawerMode === 'view' && selectedSubmission && (
          <SubmissionDetails submission={selectedSubmission} />
        )}
        {drawerMode === 'grade' && selectedSubmission && (
          <SubmissionReview
            submission={selectedSubmission}
            isSubmitting={isMutating}
            onSubmit={(marks, feedback) => gradeSubmission(selectedSubmission.assignmentSubmissionId, marks, feedback)}
          />
        )}
        {drawerMode === 'create' && (
          <SubmissionForm
            isSubmitting={isMutating}
            onSubmit={createSubmission}
          />
        )}
      </Drawer>

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (submissionToDelete) {
            await deleteSubmission(submissionToDelete.assignmentSubmissionId);
          }
        }}
        title="Delete Submission Record"
        description="Are you sure you want to delete this submission entry? This action is irreversible."
        actionType="delete"
        confirmLabel="Delete Submission"
        isLoading={isMutating}
      />
    </div>
  );
}
