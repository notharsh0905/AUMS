"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCourseResults } from '../../hooks/use-course-results';
import { CourseResult } from '../../types';
import { RESULT_STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { CourseResultForm } from '../course-result-form/course-result-form';
import { CourseResultDetails } from '../course-result-details/course-result-details';

export function CourseResultListView() {
  const {
    results,
    totalCount,
    pageCount,
    pageIndex,
    pageSize,
    isLoading,
    isMutating,
    search,
    filters,
    studentOptions,
    courseOfferingOptions,
    semesterOptions,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerMode,
    selectedResult,
    isConfirmOpen,
    setIsConfirmOpen,
    resultToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createResult,
    updateResult,
    deleteResult,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useCourseResults();

  const columns = useMemo<ColumnDef<CourseResult>[]>(
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
        header: 'Course Offered',
        id: 'courseCode',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.courseCode}
            </span>
            <span className="text-xs text-zinc-500 max-w-[200px] truncate">
              {row.original.courseName}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'credits',
        header: 'Credits',
        id: 'credits',
        cell: ({ row }) => (
          <span className="text-sm font-medium text-zinc-650 dark:text-zinc-350">
            {row.original.credits} Cr
          </span>
        ),
      },
      {
        accessorKey: 'marksObtained',
        header: 'Marks Info',
        id: 'marksObtained',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
              {row.original.marksObtained}{' '}
              <span className="text-xs font-normal text-zinc-400">
                / {row.original.totalMarks}
              </span>
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Int: {row.original.internalMarks} | Ext: {row.original.externalMarks}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'percentage',
        header: 'Percentage',
        id: 'percentage',
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {row.original.percentage.toFixed(1)}%
          </span>
        ),
      },
      {
        accessorKey: 'gradeCode',
        header: 'Grade Awarded',
        id: 'gradeCode',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-zinc-450" />
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              {row.original.gradeCode}
            </span>
            <span className="text-[10px] text-zinc-400">
              ({row.original.gradePoint?.toFixed(1)})
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'isPass',
        header: 'Outcome',
        id: 'isPass',
        cell: ({ row }) => {
          const pass = row.original.isPass;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset uppercase tracking-wide",
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
        accessorKey: 'resultStatus',
        header: 'Status',
        id: 'resultStatus',
        cell: ({ row }) => {
          const status = row.original.resultStatus;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase border",
                status === 'PUBLISHED' &&
                  "bg-emerald-50/20 text-emerald-700 border-emerald-350 dark:bg-emerald-950/10 dark:text-emerald-400",
                status === 'DRAFT' &&
                  "bg-zinc-50 text-zinc-600 border-zinc-250 dark:bg-zinc-900 dark:text-zinc-400",
                status === 'WITHHELD' &&
                  "bg-yellow-50/20 text-yellow-700 border-yellow-350 dark:bg-yellow-950/10 dark:text-yellow-450",
                status === 'REVISED' &&
                  "bg-blue-50/20 text-blue-700 border-blue-350 dark:bg-blue-950/10 dark:text-blue-450"
              )}
            >
              {status}
            </span>
          );
        },
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
              aria-label="View Course Result Card"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-lg"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit Course Result"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete Course Result"
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
      ? 'Record Course Result'
      : drawerMode === 'edit'
        ? 'Modify Course Result'
        : 'Course Result Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Create student final marks, calculates grade code, and sets results status'
      : drawerMode === 'edit'
        ? 'Update academic scores and publication dates'
        : 'Official assessment details sheet';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search student, roll number, course code..."
          />
        }
        filters={
          <div className="flex items-center gap-3">
            <SelectFilter
              label="Status"
              value={filters.status || ''}
              onChange={(val) => handleFilterChange('status', val)}
              options={RESULT_STATUS_OPTIONS}
            />
            {studentOptions.length > 0 && (
              <SelectFilter
                label="Student"
                value={filters.enrollmentId || ''}
                onChange={(val) => handleFilterChange('enrollmentId', val)}
                options={studentOptions}
              />
            )}
            {courseOfferingOptions.length > 0 && (
              <SelectFilter
                label="Course"
                value={filters.courseOfferingId || ''}
                onChange={(val) => handleFilterChange('courseOfferingId', val)}
                options={courseOfferingOptions}
              />
            )}
            {semesterOptions.length > 0 && (
              <SelectFilter
                label="Semester"
                value={filters.semesterId || ''}
                onChange={(val) => handleFilterChange('semesterId', val)}
                options={semesterOptions}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Course Result"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={results}
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
        {drawerMode === 'view' && selectedResult ? (
          <CourseResultDetails result={selectedResult} />
        ) : (
          <CourseResultForm
            initialData={selectedResult}
            studentOptions={studentOptions}
            courseOfferingOptions={courseOfferingOptions}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createResult(values);
              } else if (drawerMode === 'edit' && selectedResult) {
                updateResult(selectedResult.courseResultId, values);
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
          if (resultToDelete) {
            await deleteResult(resultToDelete.courseResultId);
          }
        }}
        title="Delete Course Result"
        description={`Are you sure you want to delete the course result for ${
          resultToDelete
            ? `${resultToDelete.studentName} (${resultToDelete.courseCode})`
            : 'this student'
        }? This operation is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Result"
        isLoading={isMutating}
      />
    </div>
  );
}
