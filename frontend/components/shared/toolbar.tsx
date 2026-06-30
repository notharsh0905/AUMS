"use client";

import React from 'react';
import { Plus, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  searchBar?: React.ReactNode;
  filters?: React.ReactNode;
  onCreateClick?: () => void;
  createLabel?: string;
  onExportClick?: () => void;
  onImportClick?: () => void;
  selectedCount?: number;
  onBulkDeleteClick?: () => void;
}

export function Toolbar({
  searchBar,
  filters,
  onCreateClick,
  createLabel = 'Create New',
  onExportClick,
  onImportClick,
  selectedCount = 0,
  onBulkDeleteClick,
}: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 py-4 px-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950/60 shadow-xs">
      {/* Top Row: Search & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input bar */}
        <div className="flex-1 max-w-sm">{searchBar}</div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          {onImportClick && (
            <Button variant="outline" size="sm" onClick={onImportClick} className="h-9 px-3 gap-1.5">
              <Upload className="h-4 w-4 text-zinc-500" />
              <span>Import</span>
            </Button>
          )}
          {onExportClick && (
            <Button variant="outline" size="sm" onClick={onExportClick} className="h-9 px-3 gap-1.5">
              <Download className="h-4 w-4 text-zinc-500" />
              <span>Export</span>
            </Button>
          )}
          {onCreateClick && (
            <Button size="sm" onClick={onCreateClick} className="h-9 px-3 gap-1.5 bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 border-none font-semibold">
              <Plus className="h-4 w-4" />
              <span>{createLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Row: Active filters or Bulk Operations */}
      {(filters || (selectedCount > 0 && onBulkDeleteClick)) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-zinc-150 dark:border-zinc-900 flex-wrap">
          {/* Active filter lists */}
          <div className="flex items-center gap-4 flex-wrap">{filters}</div>

          {/* Bulk operation selection controls */}
          {selectedCount > 0 && onBulkDeleteClick && (
            <div className="flex items-center gap-3 bg-red-50/50 dark:bg-red-950/10 border border-red-250 dark:border-red-950/30 px-3 py-1.5 rounded-lg text-sm text-red-700 dark:text-red-400">
              <span className="font-semibold">{selectedCount} rows selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={onBulkDeleteClick}
                className="h-7 px-2.5 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Selected</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
