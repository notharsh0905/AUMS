"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSemesters } from '../../hooks/use-semesters';
import { Semester } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { SemesterForm } from '../semester-form/semester-form';
import { SemesterDetails } from '../semester-details/semester-details';
import { api } from '@/services/api';

export function SemesterListView() {
  const {
    semesters,
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
    selectedSemester,
    isConfirmOpen,
    setIsConfirmOpen,
    semesterToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createSemester,
    updateSemester,
    deleteSemester,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useSemesters();

  const [academicYears, setAcademicYears] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load academic years for filters
    api.get<{ academic_year_id: string; academic_year_name: string }[]>('/academic-years')
      .then((res) => {
        const list = res.data || [];
        setAcademicYears(list.map((item) => ({ label: item.academic_year_name, value: item.academic_year_name })));
      })
      .catch(() => {});
  }, []);

  const columns = useMemo<ColumnDef<Semester>[]>(
    () => [
      {
        accessorKey: 'semesterNumber',
        header: 'Number',
        id: 'semesterNumber',
        cell: ({ row }) => `Semester ${row.original.semesterNumber}`,
      },
      {
        accessorKey: 'semesterName',
        header: 'Semester Name',
        id: 'semesterName',
      },
      {
        accessorKey: 'academicYear',
        header: 'Academic Year',
        id: 'academicYear',
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        id: 'startDate',
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        id: 'endDate',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'active';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'active' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'inactive' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
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
              aria-label="View semester details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit semester"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete semester"
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
      ? 'Add New Semester'
      : drawerMode === 'edit'
        ? 'Edit Semester'
        : 'Semester Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Register a new institutional academic semester term'
      : drawerMode === 'edit'
        ? 'Update academic year link, schedule calendar dates, or status'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name..."
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
            {academicYears.length > 0 && (
              <SelectFilter
                label="Academic Year"
                value={filters.academicYear || ''}
                onChange={(val) => handleFilterChange('academicYear', val)}
                options={academicYears}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Semester"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={semesters}
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
        {drawerMode === 'view' && selectedSemester ? (
          <SemesterDetails semester={selectedSemester} />
        ) : (
          <SemesterForm
            initialData={selectedSemester}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createSemester(values);
              } else if (drawerMode === 'edit' && selectedSemester) {
                updateSemester(selectedSemester.semesterId, values);
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
          if (semesterToDelete) {
            await deleteSemester(semesterToDelete.semesterId);
          }
        }}
        title="Delete Semester"
        description={`Are you sure you want to delete ${
          semesterToDelete ? semesterToDelete.semesterName : 'this semester'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Semester"
        isLoading={isMutating}
      />
    </div>
  );
}
