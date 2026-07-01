"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useExamRegistrations } from '../../hooks/use-exam-registrations';
import { ExamRegistration } from '../../types';
import { REGISTRATION_STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RegistrationForm } from '../registration-form/registration-form';
import { RegistrationDetails } from '../registration-details/registration-details';

export function ExamRegistrationListView() {
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
    examOptions,
    studentOptions,
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
    triggerCancel,
    registerStudent,
    updateRegistrationStatus,
    cancelRegistration,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useExamRegistrations();

  const columns = useMemo<ColumnDef<ExamRegistration>[]>(
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
        header: 'Course',
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
        accessorKey: 'examName',
        header: 'Examination',
        id: 'examName',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {row.original.examName}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wide">
              {row.original.examType}
            </span>
          </div>
        ),
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
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset uppercase tracking-wide",
                status === 'REGISTERED' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'ABSENT' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
                status === 'DISQUALIFIED' &&
                  "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20"
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'registeredAt',
        header: 'Registration Date',
        id: 'registeredAt',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {row.original.registeredAt
                ? new Date(row.original.registeredAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
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
              aria-label="View Hall Ticket"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-lg"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit Registration Status"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
              onClick={() => triggerCancel(row.original)}
              aria-label="Cancel Exam Registration"
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
        ? 'Edit Registration'
        : 'Hall Ticket Preview';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Register a student for an upcoming examination term'
      : drawerMode === 'edit'
        ? 'Modify the candidate registration status'
        : 'Verified Candidate Hall Ticket for Examination Hall Entrance';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters */}
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
            {studentOptions.length > 0 && (
              <SelectFilter
                label="Student"
                value={filters.enrollmentId || ''}
                onChange={(val) => handleFilterChange('enrollmentId', val)}
                options={studentOptions}
              />
            )}
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
            examOptions={examOptions}
            studentOptions={studentOptions}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                registerStudent(values);
              } else if (drawerMode === 'edit' && selectedRegistration) {
                updateRegistrationStatus(
                  selectedRegistration.examRegistrationId,
                  values.registrationStatus
                );
              }
            }}
          />
        )}
      </Drawer>

      {/* Confirm Cancellation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (registrationToDelete) {
            await cancelRegistration(registrationToDelete.examRegistrationId);
          }
        }}
        title="Cancel Exam Registration"
        description={`Are you sure you want to cancel the exam registration for ${
          registrationToDelete
            ? `${registrationToDelete.studentName} (${registrationToDelete.courseCode})`
            : 'this student'
        }? This action will revoke their Hall Ticket access.`}
        actionType="delete"
        confirmLabel="Cancel Registration"
        isLoading={isMutating}
      />
    </div>
  );
}
