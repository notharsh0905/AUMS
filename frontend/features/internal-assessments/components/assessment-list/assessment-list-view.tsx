"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Calculator, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAssessments } from '../../hooks/use-assessments';
import { InternalAssessment } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { AssessmentForm } from '../assessment-form/assessment-form';
import { AssessmentDetails } from '../assessment-details/assessment-details';
import { AssessmentBreakdown } from '../assessment-breakdown/assessment-breakdown';

export function AssessmentListView() {
  const {
    assessments,
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
    selectedAssessment,
    isConfirmOpen,
    setIsConfirmOpen,
    assessmentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerBreakdown,
    triggerDelete,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useAssessments();

  const columns = useMemo<ColumnDef<InternalAssessment>[]>(
    () => [
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
        id: 'course',
        header: 'Course',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{row.original.courseCode}</span>
            <span className="text-xs text-zinc-500 truncate max-w-[150px]">{row.original.courseName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'facultyName',
        header: 'Faculty',
        id: 'facultyName',
      },
      {
        accessorKey: 'attendanceMarks',
        header: 'Attendance',
        id: 'attendanceMarks',
        cell: ({ row }) => (
          <span>
            {row.original.attendanceMarks} Marks ({row.original.attendancePercentage}%)
          </span>
        ),
      },
      {
        accessorKey: 'assignmentMarks',
        header: 'Assignments',
        id: 'assignmentMarks',
      },
      {
        accessorKey: 'quizMarks',
        header: 'Quiz',
        id: 'quizMarks',
      },
      {
        accessorKey: 'practicalMarks',
        header: 'Practical',
        id: 'practicalMarks',
      },
      {
        accessorKey: 'vivaMarks',
        header: 'Viva',
        id: 'vivaMarks',
      },
      {
        accessorKey: 'midSemesterMarks',
        header: 'Mid Sem',
        id: 'midSemesterMarks',
      },
      {
        accessorKey: 'totalInternalMarks',
        header: 'Total',
        id: 'totalInternalMarks',
        cell: ({ row }) => (
          <span className="font-bold text-zinc-950 dark:text-zinc-50">
            {row.original.totalInternalMarks} / {row.original.maxMarks}
          </span>
        ),
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
                status === 'APPROVED' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'SUBMITTED' &&
                  "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
                status === 'DRAFT' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
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
              aria-label="View assessment details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit assessment"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerBreakdown(row.original)}
              aria-label="View grading breakdown calculation formula"
            >
              <Calculator className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-655 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete assessment"
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
      ? 'Record Internal Assessment Marks'
      : drawerMode === 'edit'
        ? 'Edit Internal Assessment Marks'
        : drawerMode === 'breakdown'
          ? 'Marks Calculation Formula Breakdown'
          : 'Assessment Profile View';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Record quiz, practical, viva, bonus, and mid semester exam parameters'
      : drawerMode === 'edit'
        ? 'Update quiz, practical, viva, bonus, and mid semester exam parameters'
        : drawerMode === 'breakdown'
          ? 'Shows detailed addition/deductions logic flow to sum internal marks'
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
        createLabel="Add Assessment"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={assessments}
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
        {drawerMode === 'view' && selectedAssessment && (
          <AssessmentDetails assessment={selectedAssessment} />
        )}
        {drawerMode === 'breakdown' && selectedAssessment && (
          <AssessmentBreakdown assessment={selectedAssessment} />
        )}
        {(drawerMode === 'create' || drawerMode === 'edit') && (
          <AssessmentForm
            initialData={selectedAssessment}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createAssessment(values);
              } else if (drawerMode === 'edit' && selectedAssessment) {
                updateAssessment(selectedAssessment.assessmentId, values);
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
          if (assessmentToDelete) {
            await deleteAssessment(assessmentToDelete.assessmentId);
          }
        }}
        title="Delete Internal Assessment"
        description="Are you sure you want to delete this internal assessment score record? This action is irreversible."
        actionType="delete"
        confirmLabel="Delete Assessment"
        isLoading={isMutating}
      />
    </div>
  );
}
