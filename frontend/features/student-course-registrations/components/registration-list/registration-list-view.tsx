"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRegistrations } from '../../hooks/use-registrations';
import { StudentCourseRegistration } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RegistrationForm } from '../registration-form/registration-form';
import { RegistrationDetails } from '../registration-details/registration-details';

export function RegistrationListView() {
  const {
    registrations,
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
    selectedRegistration,
    isConfirmOpen,
    setIsConfirmOpen,
    registrationToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createRegistration,
    updateRegistration,
    deleteRegistration,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useRegistrations();

  const columns = useMemo<ColumnDef<StudentCourseRegistration>[]>(
    () => [
      {
        accessorKey: 'studentId',
        header: 'Student ID',
        id: 'studentId',
      },
      {
        accessorKey: 'rollNumber',
        header: 'Roll Number',
        id: 'rollNumber',
      },
      {
        accessorKey: 'studentName',
        header: 'Student Name',
        id: 'studentName',
      },
      {
        accessorKey: 'courseCode',
        header: 'Course Code',
        id: 'courseCode',
      },
      {
        accessorKey: 'courseName',
        header: 'Course Name',
        id: 'courseName',
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
        accessorKey: 'academicYear',
        header: 'Academic Year',
        id: 'academicYear',
      },
      {
        accessorKey: 'semester',
        header: 'Semester',
        id: 'semester',
      },
      {
        accessorKey: 'registrationStatus',
        header: 'Status',
        id: 'registrationStatus',
        cell: ({ row }) => {
          const status = row.original.registrationStatus || 'REGISTERED';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'REGISTERED' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'DROPPED' &&
                  "bg-red-50 text-red-755 ring-red-500/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
                status === 'COMPLETED' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
                status === 'FAILED' &&
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
              aria-label="View registration details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit registration"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete registration"
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
      ? 'Register Student'
      : drawerMode === 'edit'
        ? 'Edit Course Registration'
        : 'Registration Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Enroll and register a student for a course section offering'
      : drawerMode === 'edit'
        ? 'Update registration status or registry enrollment details'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
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
              label="Status"
              value={filters.status || ''}
              onChange={(val) => handleFilterChange('status', val)}
              options={STATUS_OPTIONS}
            />
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Register Student"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={registrations}
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
        {drawerMode === 'view' && selectedRegistration ? (
          <RegistrationDetails registration={selectedRegistration} />
        ) : (
          <RegistrationForm
            initialData={selectedRegistration}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createRegistration(values);
              } else if (drawerMode === 'edit' && selectedRegistration) {
                updateRegistration(selectedRegistration.studentCourseRegistrationId, values);
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
          if (registrationToDelete) {
            await deleteRegistration(registrationToDelete.studentCourseRegistrationId);
          }
        }}
        title="Delete Course Registration"
        description={`Are you sure you want to cancel the registration for ${
          registrationToDelete ? registrationToDelete.studentName : 'this student'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Registration"
        isLoading={isMutating}
      />
    </div>
  );
}
