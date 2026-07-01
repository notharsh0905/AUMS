"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProgramResults } from '../../hooks/use-program-results';
import { ProgramResult } from '../../types';
import { RESULT_STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ProgramResultForm } from '../program-result-form/program-result-form';
import { ProgramResultDetails } from '../program-result-details/program-result-details';

export function ProgramResultListView() {
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
    batchOptions,
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
  } = useProgramResults();

  const filteredResults = useMemo(() => {
    const batchFilter = filters.batch;
    if (batchFilter) {
      return results.filter((r) => r.batch === batchFilter);
    }
    return results;
  }, [results, filters]);

  const columns = useMemo<ColumnDef<ProgramResult>[]>(
    () => [
      {
        accessorKey: 'studentName',
        header: 'Student Candidate',
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
        header: 'Program Name',
        id: 'programCode',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.programCode}
            </span>
            <span className="text-xs text-zinc-500 max-w-[180px] truncate">
              {row.original.programName}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'batch',
        header: 'Batch Year',
        id: 'batch',
        cell: ({ row }) => (
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {row.original.batch}
          </span>
        ),
      },
      {
        accessorKey: 'cgpa',
        header: 'CGPA',
        id: 'cgpa',
        cell: ({ row }) => (
          <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
            {row.original.cgpa.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'totalCredits',
        header: 'Credits Earned',
        id: 'totalCredits',
        cell: ({ row }) => (
          <span className="text-sm font-medium text-zinc-650 dark:text-zinc-350">
            {row.original.earnedCredits} <span className="text-xs text-zinc-400">/ {row.original.totalCredits}</span>
          </span>
        ),
      },
      {
        accessorKey: 'graduationEligibility',
        header: 'Graduation',
        id: 'graduationEligibility',
        cell: ({ row }) => {
          const eligible = row.original.graduationEligibility === 'ELIGIBLE' || row.original.degreeCompleted;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset uppercase tracking-wide",
                eligible
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
                  : "bg-zinc-100 text-zinc-600 ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
              )}
            >
              {eligible ? 'ELIGIBLE' : 'INCOMPLETE'}
            </span>
          );
        },
      },
      {
        accessorKey: 'degreeClassification',
        header: 'Classification',
        id: 'degreeClassification',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-zinc-405" />
            <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
              {row.original.degreeClassification}
            </span>
          </div>
        ),
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
              aria-label="View Program Result Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-lg"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit Program Result"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete Program Result"
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
      ? 'Record Program Result'
      : drawerMode === 'edit'
        ? 'Modify Program Result'
        : 'Cumulative GPA Scorecard';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Enter candidate final graduation CGPA and completed credit milestones'
      : drawerMode === 'edit'
        ? 'Update graduation data and degrees completion statuses'
        : 'Official graduation credentials sheet';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search student, roll number, program..."
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
            {programOptions.length > 0 && (
              <SelectFilter
                label="Program"
                value={filters.programId || ''}
                onChange={(val) => handleFilterChange('programId', val)}
                options={programOptions}
              />
            )}
            {batchOptions.length > 0 && (
              <SelectFilter
                label="Batch"
                value={filters.batch || ''}
                onChange={(val) => handleFilterChange('batch', val)}
                options={batchOptions}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Program Result"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredResults}
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
          <ProgramResultDetails result={selectedResult} />
        ) : (
          <ProgramResultForm
            initialData={selectedResult}
            studentOptions={studentOptions}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createResult(values);
              } else if (drawerMode === 'edit' && selectedResult) {
                updateResult(selectedResult.programResultId, values);
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
            await deleteResult(resultToDelete.programResultId);
          }
        }}
        title="Delete Program Result"
        description={`Are you sure you want to delete the program result for ${
          resultToDelete
            ? `${resultToDelete.studentName} (${resultToDelete.programCode})`
            : 'this student'
        }? This operation is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Result"
        isLoading={isMutating}
      />
    </div>
  );
}
