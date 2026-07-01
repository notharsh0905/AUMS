"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePrograms } from '../../hooks/use-programs';
import { Program } from '../../types';
import { STATUS_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ProgramForm } from '../program-form/program-form';
import { ProgramDetails } from '../program-details/program-details';
import { api } from '@/services/api';

export function ProgramListView() {
  const {
    programs,
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
    selectedProgram,
    isConfirmOpen,
    setIsConfirmOpen,
    programToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createProgram,
    updateProgram,
    deleteProgram,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = usePrograms();

  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    api.get<{ department_name: string; department_id: string }[]>('/departments')
      .then((res) => {
        const list = res.data || [];
        setDepartments(list.map((d) => ({ label: d.department_name, value: d.department_name })));
      })
      .catch(() => {});
  }, []);

  const columns = useMemo<ColumnDef<Program>[]>(
    () => [
      {
        accessorKey: 'programId',
        header: 'Program ID',
        id: 'programId',
      },
      {
        accessorKey: 'programCode',
        header: 'Code',
        id: 'programCode',
      },
      {
        accessorKey: 'programName',
        header: 'Name',
        id: 'programName',
      },
      {
        accessorKey: 'department',
        header: 'Department',
        id: 'department',
      },
      {
        accessorKey: 'degreeType',
        header: 'Degree',
        id: 'degreeType',
      },
      {
        accessorKey: 'durationValue',
        header: 'Duration',
        id: 'durationValue',
        cell: ({ row }) => `${row.original.durationValue} ${row.original.durationUnit.toLowerCase()}`,
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
              aria-label="View program details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit program"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete program"
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
      ? 'Add New Program'
      : drawerMode === 'edit'
        ? 'Edit Program'
        : 'Program Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Fill in the details to register a new program'
      : drawerMode === 'edit'
        ? 'Update program name, department mappings, or status'
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
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Program"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={programs}
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
        {drawerMode === 'view' && selectedProgram ? (
          <ProgramDetails program={selectedProgram} />
        ) : (
          <ProgramForm
            initialData={selectedProgram}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createProgram(values);
              } else if (drawerMode === 'edit' && selectedProgram) {
                updateProgram(selectedProgram.programId, values);
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
          if (programToDelete) {
            await deleteProgram(programToDelete.programId);
          }
        }}
        title="Delete Program"
        description={`Are you sure you want to delete ${
          programToDelete ? programToDelete.programName : 'this program'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Program"
        isLoading={isMutating}
      />
    </div>
  );
}
