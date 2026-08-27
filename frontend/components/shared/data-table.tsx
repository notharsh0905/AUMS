"use client";

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, SlidersHorizontal, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableSkeleton } from './loading-skeletons';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { Pagination } from './pagination';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  pageCount: number;
  onPageChange: (index: number) => void;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  emptyAction?: React.ReactNode;
  sorting?: SortingState;
  onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  ariaLabel?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  totalItems,
  pageCount,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  error = null,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  ariaLabel = "Data table",
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Header Toolbar Options (Column Visibility) */}
      <div className="flex items-center justify-end gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="Toggle column visibility"
            className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-900 dark:text-zinc-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 shadow-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <span>Columns</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDropdownOpen(false)}
              />
              <div
                role="menu"
                aria-label="Columns visibility menu"
                className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-lg z-40 max-h-60 overflow-y-auto"
              >
                <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-900 mb-1">
                  Toggle Columns
                </div>
                {table
                  .getAllLeafColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={col.getIsVisible()}
                        onChange={(e) => col.toggleVisibility(e.target.checked)}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 h-3.5 w-3.5"
                      />
                      <span className="capitalize">{col.id}</span>
                    </label>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Main Content State Machine */}
      {error ? (
        <ErrorState
          title="Unable to load records"
          description={error}
          retryCallback={onRetry}
        />
      ) : isLoading ? (
        <TableSkeleton rows={pageSize || 5} cols={columns.length} />
      ) : data.length === 0 ? (
        <EmptyState
          title={emptyTitle || "No records found"}
          description={emptyDescription || "There are currently no records available in this view. Broaden your search filters or add a new record."}
          icon={emptyIcon}
          actionButton={emptyAction}
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table
              role="table"
              aria-label={ariaLabel}
              className="w-full text-left border-collapse text-sm"
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-zinc-50/75 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-6 py-3.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider select-none"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-1.5",
                              header.column.getCanSort() && "cursor-pointer select-none hover:text-zinc-950 dark:hover:text-zinc-50"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors",
                      row.getIsSelected() && "bg-indigo-50/30 dark:bg-indigo-950/10"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-3.5 text-zinc-900 dark:text-zinc-200 leading-normal text-xs"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3. Embedded Pagination component */}
          <Pagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalItems={totalItems}
            pageCount={pageCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
