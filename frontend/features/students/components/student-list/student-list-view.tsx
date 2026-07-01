"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStudents } from '../../hooks/use-students';
import { Student } from '../../types';
import { STATUS_OPTIONS, DEPARTMENT_OPTIONS, PROGRAM_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { StudentForm } from '../student-form/student-form';
import { StudentDetails } from '../student-details/student-details';

import { useAuth } from '@/providers/auth-provider';

export function StudentListView() {
  const { hasPermission } = useAuth();
  const {
    students,
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
    selectedStudent,
    isConfirmOpen,
    setIsConfirmOpen,
    studentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createStudent,
    updateStudent,
    deleteStudent,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useStudents();

  // Define table columns
  const columns = useMemo<ColumnDef<Student>[]>(
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
        id: 'name',
        header: 'Name',
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        id: 'email',
      },
      {
        accessorKey: 'program',
        header: 'Program',
        id: 'program',
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
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'active' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'inactive' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
                status === 'suspended' &&
                  "bg-red-50 text-red-750 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
                status === 'graduated' &&
                  "bg-blue-50 text-blue-750 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20"
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
              aria-label="View student details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            {hasPermission('students.update') && (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 text-zinc-500 hover:text-zinc-955 dark:hover:text-zinc-50"
                onClick={() => triggerEdit(row.original)}
                aria-label="Edit student profile"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
            {hasPermission('students.delete') && (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 text-red-650 hover:text-red-755 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={() => triggerDelete(row.original)}
                aria-label="Delete student record"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasPermission]
  );

  const drawerTitle =
    drawerMode === 'create'
      ? 'Add New Student'
      : drawerMode === 'edit'
        ? 'Edit Student Profile'
        : 'Student Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Fill in the information to register a new student'
      : drawerMode === 'edit'
        ? 'Update academic or personal attributes'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name, roll number, email..."
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
            <SelectFilter
              label="Department"
              value={filters.department || ''}
              onChange={(val) => handleFilterChange('department', val)}
              options={DEPARTMENT_OPTIONS}
            />
            <SelectFilter
              label="Program"
              value={filters.program || ''}
              onChange={(val) => handleFilterChange('program', val)}
              options={PROGRAM_OPTIONS}
            />
          </div>
        }
        onCreateClick={hasPermission('students.create') ? triggerCreate : undefined}
        createLabel="Add Student"
      />

      {/* Main Datatable */}
      <DataTable
        columns={columns}
        data={students}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalCount}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />

      {/* 1. Modal Drawer for form submissions / details view */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerTitle}
        description={drawerDescription}
        size="lg"
      >
        {drawerMode === 'view' && selectedStudent ? (
          <StudentDetails student={selectedStudent} />
        ) : (
          <StudentForm
            initialData={selectedStudent}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createStudent(values);
              } else if (drawerMode === 'edit' && selectedStudent) {
                updateStudent(selectedStudent.studentId, values);
              }
            }}
          />
        )}
      </Drawer>

      {/* 2. Deletion Confirm Alert dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (studentToDelete) {
            await deleteStudent(studentToDelete.studentId);
          }
        }}
        title="Delete Student Record"
        description={`Are you sure you want to delete ${
          studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : 'this student'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Record"
        isLoading={isMutating}
      />
    </div>
  );
}
