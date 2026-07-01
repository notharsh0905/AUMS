"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSemesterResults } from '../../hooks/use-semester-results';
import { SemesterResult } from '../../types';
import { RESULT_STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { SemesterResultForm } from '../semester-result-form/semester-result-form';
import { SemesterResultDetails } from '../semester-result-details/semester-result-details';

export function SemesterResultListView() {
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
    programOptions,
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
  } = useSemesterResults();

  const columns = useMemo<ColumnDef<SemesterResult>[]>(
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
        accessorKey: 'programCode',
        header: 'Program / Branch',
        id: 'programCode',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.programCode}
            </span>
            <span className="text-xs text-zinc-500 max-w-[200px] truncate">
              {row.original.programName}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'semesterName',
        header: 'Semester Term',
        id: 'semesterName',
        cell: ({ row }) => (
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {row.original.semesterName}
          </span>
        ),
      },
      {
        accessorKey: 'sgpa',
        header: 'SGPA',
        id: 'sgpa',
        cell: ({ row }) => (
          <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
            {row.original.sgpa.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'totalCredits',
        header: 'Credits (Earned / Total)',
        id: 'totalCredits',
        cell: ({ row }) => (
          <span className="text-sm font-medium text-zinc-650 dark:text-zinc-350">
            {row.original.earnedCredits} <span className="text-xs text-zinc-400">/ {row.original.totalCredits}</span>
          </span>
        ),
      },
      {
        accessorKey: 'backlogCount',
        header: 'Backlogs',
        id: 'backlogCount',
        cell: ({ row }) => {
          const count = row.original.backlogCount || 0;
          return (
            <span className={cn(
              "text-xs font-semibold",
              count > 0 ? "text-yellow-600 dark:text-yellow-450" : "text-zinc-500"
            )}>
              {count}
            </span>
          );
        },
      },
      {
        accessorKey: 'academicStanding',
        header: 'Standing',
        id: 'academicStanding',
        cell: ({ row }) => {
          const standing = row.original.academicStanding;
          return (
            <span className="inline-flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-zinc-405" />
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {standing}
              </span>
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
              aria-label="View Semester Result Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-lg"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit Semester Result"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete Semester Result"
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
      ? 'Record Semester Result'
      : drawerMode === 'edit'
        ? 'Modify Semester Result'
        : 'Semester SGPA Report';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Enter student SGPA and credit achievements for the academic term'
      : drawerMode === 'edit'
        ? 'Update academic scores and publication dates'
        : 'Official term progression report';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search student, roll, program, semester..."
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
            {semesterOptions.length > 0 && (
              <SelectFilter
                label="Semester"
                value={filters.semesterId || ''}
                onChange={(val) => handleFilterChange('semesterId', val)}
                options={semesterOptions}
              />
            )}
            {programOptions.length > 0 && (
              <SelectFilter
                label="Program"
                value={filters.programId || ''}
                onChange={(val) => handleFilterChange('programId', val)}
                options={programOptions}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Term Result"
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
          <SemesterResultDetails result={selectedResult} />
        ) : (
          <SemesterResultForm
            initialData={selectedResult}
            studentOptions={studentOptions}
            semesterOptions={semesterOptions}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createResult(values);
              } else if (drawerMode === 'edit' && selectedResult) {
                updateResult(selectedResult.semesterResultId, values);
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
            await deleteResult(resultToDelete.semesterResultId);
          }
        }}
        title="Delete Semester Result"
        description={`Are you sure you want to delete the semester result for ${
          resultToDelete
            ? `${resultToDelete.studentName} (${resultToDelete.semesterName})`
            : 'this student'
        }? This operation is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Result"
        isLoading={isMutating}
      />
    </div>
  );
}
