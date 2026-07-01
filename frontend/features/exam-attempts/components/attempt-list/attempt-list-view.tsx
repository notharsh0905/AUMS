"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useExamAttempts } from '../../hooks/use-exam-attempts';
import { ExamAttempt } from '../../types';
import { REGISTRATION_STATUS_OPTIONS } from '@/features/exam-registrations/constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { MarksEntryForm } from '../marks-entry-form/marks-entry-form';
import { AttemptDetails } from '../attempt-details/attempt-details';

export function ExamAttemptListView() {
  const {
    attempts,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    filters,
    examOptions,
    evaluatorOptions,
    registrationOptions,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedAttempt,
    isConfirmOpen,
    setIsConfirmOpen,
    attemptToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    recordAttemptMarks,
    updateAttemptMarks,
    deleteAttempt,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useExamAttempts();

  const columns = useMemo<ColumnDef<ExamAttempt>[]>(
    () => [
      {
        accessorKey: 'studentName',
        header: 'Student Name',
        id: 'studentName',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {row.original.studentName}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {row.original.rollNumber}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'courseCode',
        header: 'Course / Exam',
        id: 'courseCode',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.courseCode} - {row.original.examName}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wide">
              {row.original.examType}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'attemptNumber',
        header: 'Attempt',
        id: 'attemptNumber',
        cell: ({ row }) => (
          <span className="text-sm text-zinc-650 font-medium">
            Attempt #{row.original.attemptNumber}
          </span>
        ),
      },
      {
        accessorKey: 'marksObtained',
        header: 'Marks Obtained',
        id: 'marksObtained',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-50 text-sm">
            <Award className="h-4 w-4 text-zinc-400" />
            <span>
              {row.original.marksObtained}{' '}
              <span className="text-xs font-normal text-zinc-400">
                / {row.original.maxMarks || 100}
              </span>
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'isPass',
        header: 'Result',
        id: 'isPass',
        cell: ({ row }) => {
          const pass = row.original.isPass;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset uppercase tracking-wide",
                pass
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                  : "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
              )}
            >
              {pass ? 'PASS' : 'FAIL'}
            </span>
          );
        },
      },
      {
        accessorKey: 'evaluatorName',
        header: 'Evaluator',
        id: 'evaluatorName',
        cell: ({ row }) => (
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {row.original.evaluatorName}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-lg"
              onClick={() => triggerView(row.original)}
              aria-label="View Evaluation Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-lg"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit Marks"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete Marks Log"
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
      ? 'Record Exam Marks'
      : drawerMode === 'edit'
        ? 'Modify Recorded Marks'
        : 'Evaluation Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Record candidate marks, internal/external split, and evaluator data'
      : drawerMode === 'edit'
        ? 'Update marks or re-assigned evaluator credentials'
        : 'Detailed assessment evaluation card';

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search student, roll number, course..."
          />
        }
        filters={
          <div className="flex items-center gap-3">
            <SelectFilter
              label="Registration Status"
              value={filters.status || ''}
              onChange={(val) => handleFilterChange('status', val)}
              options={REGISTRATION_STATUS_OPTIONS}
            />
            {examOptions.length > 0 && (
              <SelectFilter
                label="Exam"
                value={filters.examId || ''}
                onChange={(val) => handleFilterChange('examId', val)}
                options={examOptions}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Record Marks"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={attempts}
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
        {drawerMode === 'view' && selectedAttempt ? (
          <AttemptDetails attempt={selectedAttempt} />
        ) : (
          <MarksEntryForm
            initialData={selectedAttempt}
            evaluatorOptions={evaluatorOptions}
            registrationOptions={registrationOptions}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                recordAttemptMarks(values);
              } else if (drawerMode === 'edit' && selectedAttempt) {
                updateAttemptMarks(selectedAttempt.examAttemptId, values);
              }
            }}
          />
        )}
      </Drawer>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (attemptToDelete) {
            await deleteAttempt(attemptToDelete.examAttemptId);
          }
        }}
        title="Delete Marks Entry"
        description={`Are you sure you want to delete the exam attempt marks log for ${
          attemptToDelete
            ? `${attemptToDelete.studentName} (${attemptToDelete.courseCode})`
            : 'this attempt'
        }? This operation is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Marks Log"
        isLoading={isMutating}
      />
    </div>
  );
}
