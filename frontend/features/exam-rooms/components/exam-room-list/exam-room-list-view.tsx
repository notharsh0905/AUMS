"use client";

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useExamRooms } from '../../hooks/use-exam-rooms';
import { ExamRoom } from '../../types';
import { STATUS_OPTIONS, ROOM_TYPE_OPTIONS } from '../../constants';
import { DataTable } from '@/components/shared/data-table';
import { SearchBar } from '@/components/shared/search-bar';
import { SelectFilter } from '@/components/shared/filters';
import { Toolbar } from '@/components/shared/toolbar';
import { Drawer } from '@/components/shared/drawer-modal';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ExamRoomForm } from '../exam-room-form/exam-room-form';
import { ExamRoomDetails } from '../exam-room-details/exam-room-details';

export function ExamRoomListView() {
  const {
    examRooms,
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
    selectedRoom,
    isConfirmOpen,
    setIsConfirmOpen,
    roomToDelete,
    triggerCreate,
    triggerEdit,
    triggerView,
    triggerDelete,
    createExamRoom,
    updateExamRoom,
    deleteExamRoom,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleFilterChange,
  } = useExamRooms();

  // Extract unique building options from the current loaded list for the building filter
  const buildingOptions = useMemo(() => {
    const buildings = Array.from(new Set(examRooms.map((r) => r.building)));
    return buildings.map((b) => ({ label: b, value: b }));
  }, [examRooms]);

  const columns = useMemo<ColumnDef<ExamRoom>[]>(
    () => [
      {
        accessorKey: 'building',
        header: 'Building',
        id: 'building',
      },
      {
        accessorKey: 'roomNumber',
        header: 'Room Number',
        id: 'roomNumber',
      },
      {
        accessorKey: 'roomName',
        header: 'Room Name',
        id: 'roomName',
      },
      {
        accessorKey: 'capacity',
        header: 'Capacity',
        id: 'capacity',
        cell: ({ row }) => (
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {row.original.capacity} seats
          </span>
        ),
      },
      {
        accessorKey: 'roomType',
        header: 'Room Type',
        id: 'roomType',
        cell: ({ row }) => {
          const type = row.original.roomType || 'CLASSROOM';
          return type.replace('_', ' ');
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        id: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'ACTIVE';
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset uppercase tracking-wide",
                status === 'ACTIVE' &&
                  "bg-emerald-50 text-emerald-755 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
                status === 'INACTIVE' &&
                  "bg-zinc-50 text-zinc-650 ring-zinc-500/10 dark:bg-zinc-500/10 dark:text-zinc-400 dark:ring-zinc-500/20",
                status === 'MAINTENANCE' &&
                  "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20"
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
              aria-label="View exam room details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-lg"
              onClick={() => triggerEdit(row.original)}
              aria-label="Edit exam room"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 text-red-650 hover:text-red-750 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
              onClick={() => triggerDelete(row.original)}
              aria-label="Delete exam room"
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
      ? 'Add Exam Room'
      : drawerMode === 'edit'
        ? 'Edit Exam Room'
        : 'Exam Room Details';

  const drawerDescription =
    drawerMode === 'create'
      ? 'Fill in the form to register a new examination room'
      : drawerMode === 'edit'
        ? 'Update building location, room details, or capacity configurations'
        : 'Read-only administrative overview';

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filter Toolbar */}
      <Toolbar
        searchBar={
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search building, number, name..."
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
              label="Room Type"
              value={filters.roomType || ''}
              onChange={(val) => handleFilterChange('roomType', val)}
              options={ROOM_TYPE_OPTIONS}
            />
            {buildingOptions.length > 0 && (
              <SelectFilter
                label="Building"
                value={filters.building || ''}
                onChange={(val) => handleFilterChange('building', val)}
                options={buildingOptions}
              />
            )}
          </div>
        }
        onCreateClick={triggerCreate}
        createLabel="Add Room"
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={examRooms}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalCount}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />

      {/* Drawer Form / Details */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerTitle}
        description={drawerDescription}
        size="lg"
      >
        {drawerMode === 'view' && selectedRoom ? (
          <ExamRoomDetails room={selectedRoom} />
        ) : (
          <ExamRoomForm
            initialData={selectedRoom}
            isSubmitting={isMutating}
            onSubmit={(values) => {
              if (drawerMode === 'create') {
                createExamRoom(values);
              } else if (drawerMode === 'edit' && selectedRoom) {
                updateExamRoom(selectedRoom.examRoomId, values);
              }
            }}
          />
        )}
      </Drawer>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          if (roomToDelete) {
            await deleteExamRoom(roomToDelete.examRoomId);
          }
        }}
        title="Delete Exam Room"
        description={`Are you sure you want to delete ${
          roomToDelete ? `${roomToDelete.building} - Room ${roomToDelete.roomNumber}` : 'this exam room'
        }? This action is irreversible.`}
        actionType="delete"
        confirmLabel="Delete Exam Room"
        isLoading={isMutating}
      />
    </div>
  );
}
