"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCourseOfferings } from '../../hooks/use-course-offerings';
import { CourseOffering } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { CourseOfferingForm } from '../course-offering-form/course-offering-form';
import { CourseOfferingDetails } from '../course-offering-details/course-offering-details';
import { api } from '@/services/api';

export function CourseOfferingListView() {
  const {
    courseOfferings,
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
    selectedCourseOffering,
    isConfirmOpen,
    setIsConfirmOpen,
    offeringToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createOffering,
    updateOffering,
    deleteOffering,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useCourseOfferings();

  const [academicYears, setAcademicYears] = useState<{ label: string; value: string }[]>([]);
  const [semestersList, setSemestersList] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Load academic years for filters
    api.get<{ academic_year_id: string; academic_year_name: string }[]>('/academic-years')
      .then((res) => {
        const list = res.data || [];
        setAcademicYears(list.map((item) => ({ label: item.academic_year_name, value: item.academic_year_name })));
      })
      .catch(() => {});

    // Load semesters for filters
    api.get<{ semester_id: string; semester_name: string }[]>('/semesters')
      .then((res) => {
        const list = res.data || [];
        setSemestersList(list.map((item) => ({ label: item.semester_name, value: item.semester_name })));
      })
      .catch(() => {});
  }, []);

  const columns = useMemo<ColumnDef<CourseOffering>[]>(
    () => [
      {
        accessorKey: 'courseCode',
        header: 'Code',
        id: 'courseCode',
      },
      {
        accessorKey: 'courseName',
        header: 'Course Name',
        id: 'courseName',
      },
      {
        accessorKey: 'section',
        header: 'Section',
        id: 'section',
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
        accessorKey: 'maxCapacity',
        header: 'Capacity',
        id: 'maxCapacity',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'PLANNED';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                status === 'ACTIVE' &&
                  "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'PLANNED' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
                status === 'COMPLETED' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
                status === 'CANCELLED' &&
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
              aria-label="View course offering details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit course offering"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete course offering"
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
      ? 'Add New Course Offering'
      : drawerMode === 'edit'
        ? 'Edit Course Offering'
        : 'Course Offering Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Define and allocate a course to an academic term section'
      : drawerMode === 'edit'
        ? 'Update section, enrollment capacity limits, or offering status'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search course code, name..."
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
            {semestersList.length > 0 && (
              <SelectFilter
                label="Semester"
                value={filters.semester || ''}
                onChange={(val) => handleFilterChange('semester', val)}
                options={semestersList}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Offering"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={courseOfferings}
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
        {drawerMode === 'view' && selectedCourseOffering ? (
          <CourseOfferingDetails offering={selectedCourseOffering} />
        ) : (
          <CourseOfferingForm
            initialData={selectedCourseOffering}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createOffering(values);
              } else if (drawerMode === 'edit' && selectedCourseOffering) {
                updateOffering(selectedCourseOffering.courseOfferingId, values);
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
          if (offeringToDelete) {
            await deleteOffering(offeringToDelete.courseOfferingId);
          }
        }}
        title="Delete Course Offering"
        description={`Are you sure you want to delete the course offering for ${
          offeringToDelete ? offeringToDelete.courseName : 'this course'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Offering"
        isLoading={isMutating}
      />
    </div>
  );
}
