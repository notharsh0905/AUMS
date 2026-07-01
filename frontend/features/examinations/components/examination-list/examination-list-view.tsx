"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useExams } from '../../hooks/use-exams';
import { Examination } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ExamForm } from '../examination-form/examination-form';
import { ExaminationDetails } from '../examination-details/examination-details';
import { ExaminationSchedule } from '../examination-schedule/examination-schedule';

export function ExaminationListView() {
  const {
    exams,
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
    selectedExam,
    isConfirmOpen,
    setIsConfirmOpen,
    examToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerSchedule,
    triggerDelete,
    createExam,
    updateExam,
    deleteExam,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useExams();

  const columns = useMemo<ColumnDef<Examination>[]>(
    () => [
      {
        accessorKey: 'examName',
        header: 'Exam',
        id: 'examName',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{row.original.examName}</span>
            <span className="text-[10px] text-zinc-400">{row.original.examType.replace('_', ' ')}</span>
          </div>
        ),
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
        accessorKey: 'examDate',
        header: 'Date',
        id: 'examDate',
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
                status === 'COMPLETED' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'SCHEDULED' &&
                  "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
                status === 'ONGOING' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
                status === 'CANCELLED' &&
                  "bg-red-50 text-red-755 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
                status === 'DRAFT' &&
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
              aria-label="View exam details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit exam"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerSchedule(row.original)}
              aria-label="View examination schedule details"
            >
              <Calendar className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-655 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Cancel or delete exam"
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
      ? 'Create Examination'
      : drawerMode === 'edit'
        ? 'Edit Examination'
        : drawerMode === 'schedule'
          ? 'Exam Session Timing Schedule'
          : 'Examination Profile Overview';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Record a new academic midterm or endterm semester theory papers schedule'
      : drawerMode === 'edit'
        ? 'Update academic midterm or endterm semester theory papers schedule'
        : drawerMode === 'schedule'
          ? 'Shows detailed timings, invigilator faculty, duration, and admit cards instructions'
          : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search exam, course..."
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
        createLabel="Add Exam"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={exams}
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
        {drawerMode === 'view' && selectedExam && (
          <ExaminationDetails exam={selectedExam} />
        )}
        {drawerMode === 'schedule' && selectedExam && (
          <ExaminationSchedule exam={selectedExam} />
        )}
        {(drawerMode === 'create' || drawerMode === 'edit') && (
          <ExamForm
            initialData={selectedExam}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createExam(values);
              } else if (drawerMode === 'edit' && selectedExam) {
                updateExam(selectedExam.examId, values);
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
          if (examToDelete) {
            await deleteExam(examToDelete.examId);
          }
        }}
        title="Delete Examination"
        description="Are you sure you want to cancel or delete this examination entry? This action is irreversible."
        actionType="delete"
        confirmLabel="Cancel Exam"
        isLoading={isMutating}
      />
    </div>
  );
}
