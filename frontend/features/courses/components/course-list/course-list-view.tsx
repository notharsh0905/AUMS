"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCourses } from '../../hooks/use-courses';
import { Course } from '../../types';
import { STATUS_OPTIONS, COURSE_TYPE_OPTIONS, SEMESTER_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { CourseForm } from '../course-form/course-form';
import { CourseDetails } from '../course-details/course-details';
import { api } from '@/services/api';

export function CourseListView() {
  const {
    courses,
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
    selectedCourse,
    isConfirmOpen,
    setIsConfirmOpen,
    courseToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createCourse,
    updateCourse,
    deleteCourse,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useCourses();

  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);
  const [programs, setPrograms] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load departments
    api.get<{ department_name: string; department_id: string }[]>('/departments')
      .then((res) => {
        const list = res.data || [];
        setDepartments(list.map((d) => ({ label: d.department_name, value: d.department_name })));
      })
      .catch(() => {});

    // Load programs
    api.get<{ program_name: string; program_id: string }[]>('/programs')
      .then((res) => {
        const list = res.data || [];
        setPrograms(list.map((p) => ({ label: p.program_name, value: p.program_name })));
      })
      .catch(() => {});
  }, []);

  const columns = useMemo<ColumnDef<Course>[]>(
    () => [
      {
        accessorKey: 'courseCode',
        header: 'Code',
        id: 'courseCode',
      },
      {
        accessorKey: 'courseName',
        header: 'Name',
        id: 'courseName',
      },
      {
        accessorKey: 'credits',
        header: 'Credits',
        id: 'credits',
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
        accessorKey: 'semester',
        header: 'Semester',
        id: 'semester',
        cell: ({ row }) => `Sem ${row.original.semester}`,
      },
      {
        accessorKey: 'courseType',
        header: 'Type',
        id: 'courseType',
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
              aria-label="View course details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit course"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete course"
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
      ? 'Add New Course'
      : drawerMode === 'edit'
        ? 'Edit Course'
        : 'Course Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Fill in the details to register a new catalog course'
      : drawerMode === 'edit'
        ? 'Update course name, credit allocations, or catalog mappings'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search code, name..."
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
            {departments.length > 0 && (
              <SelectFilter
                label="Department"
                value={filters.department || ''}
                onChange={(val) => handleFilterChange('department', val)}
                options={departments}
              />
            )}
            {programs.length > 0 && (
              <SelectFilter
                label="Program"
                value={filters.program || ''}
                onChange={(val) => handleFilterChange('program', val)}
                options={programs}
              />
            )}
            <SelectFilter
              label="Semester"
              value={filters.semester || ''}
              onChange={(val) => handleFilterChange('semester', val)}
              options={SEMESTER_OPTIONS}
            />
            <SelectFilter
              label="Type"
              value={filters.courseType || ''}
              onChange={(val) => handleFilterChange('courseType', val)}
              options={COURSE_TYPE_OPTIONS}
            />
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Course"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={courses}
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
        {drawerMode === 'view' && selectedCourse ? (
          <CourseDetails course={selectedCourse} />
        ) : (
          <CourseForm
            initialData={selectedCourse}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createCourse(values);
              } else if (drawerMode === 'edit' && selectedCourse) {
                updateCourse(selectedCourse.courseId, values);
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
          if (courseToDelete) {
            await deleteCourse(courseToDelete.courseId);
          }
        }}
        title="Delete Course"
        description={`Are you sure you want to delete ${
          courseToDelete ? courseToDelete.courseName : 'this course'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Course"
        isLoading={isMutating}
      />
    </div>
  );
}
