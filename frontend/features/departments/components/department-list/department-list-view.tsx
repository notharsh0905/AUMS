"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDepartments } from '../../hooks/use-departments';
import { Department } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { DepartmentForm } from '../department-form/department-form';
import { DepartmentDetails } from '../department-details/department-details';
import { api } from '@/services/api';

export function DepartmentListView() {
  const {
    departments,
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
    selectedDepartment,
    isConfirmOpen,
    setIsConfirmOpen,
    departmentToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useDepartments();

  const [schools, setSchools] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    api.get<{ school_name: string; school_id: string }[]>('/schools')
      .then((res) => {
        const list = res.data || [];
        setSchools(list.map((s) => ({ label: s.school_name, value: s.school_name })));
      })
      .catch(() => {});
  }, []);

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        accessorKey: 'departmentId',
        header: 'Department ID',
        id: 'departmentId',
      },
      {
        accessorKey: 'departmentCode',
        header: 'Code',
        id: 'departmentCode',
      },
      {
        accessorKey: 'departmentName',
        header: 'Name',
        id: 'departmentName',
      },
      {
        accessorKey: 'school',
        header: 'School',
        id: 'school',
      },
      {
        accessorKey: 'hod',
        header: 'HOD',
        id: 'hod',
        cell: ({ row }) => row.original.hod || 'N/A',
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
              aria-label="View department details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit department"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete department"
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
      ? 'Add New Department'
      : drawerMode === 'edit'
        ? 'Edit Department'
        : 'Department Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Fill in the details to register a new department'
      : drawerMode === 'edit'
        ? 'Update code name, school mappings, or status'
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
            {schools.length > 0 && (
              <SelectFilter
                label="School"
                value={filters.school || ''}
                onChange={(val) => handleFilterChange('school', val)}
                options={schools}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Department"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={departments}
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
        {drawerMode === 'view' && selectedDepartment ? (
          <DepartmentDetails department={selectedDepartment} />
        ) : (
          <DepartmentForm
            initialData={selectedDepartment}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createDepartment(values);
              } else if (drawerMode === 'edit' && selectedDepartment) {
                updateDepartment(selectedDepartment.departmentId, values);
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
          if (departmentToDelete) {
            await deleteDepartment(departmentToDelete.departmentId);
          }
        }}
        title="Delete Department"
        description={`Are you sure you want to delete ${
          departmentToDelete ? departmentToDelete.departmentName : 'this department'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Department"
        isLoading={isMutating}
      />
    </div>
  );
}
