"use client";

import React from 'react';
import { Trash2, Archive, ShieldAlert, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConfirmActionType = 'delete' | 'archive' | 'suspend' | 'restore';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  actionType?: ConfirmActionType;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

const typeConfig = {
  delete: {
    icon: Trash2,
    colorClass: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20',
    buttonVariant: 'destructive' as const,
    defaultLabel: 'Delete',
  },
  archive: {
    icon: Archive,
    colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
    buttonVariant: 'outline' as const,
    defaultLabel: 'Archive',
  },
  suspend: {
    icon: ShieldAlert,
    colorClass: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800',
    buttonVariant: 'outline' as const,
    defaultLabel: 'Suspend',
  },
  restore: {
    icon: RotateCcw,
    colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    buttonVariant: 'outline' as const,
    defaultLabel: 'Restore',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType = 'delete',
  confirmLabel,
  cancelLabel = 'Cancel',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const config = typeConfig[actionType] || typeConfig.delete;
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay background */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      {/* Dialog box */}
      <div className="relative bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl w-full max-w-md max-h-full overflow-y-auto animate-in fade-in zoom-in-95 duration-200 z-50">
        <div className="flex items-start gap-4">
          <div className={cn("p-2.5 rounded-lg flex-shrink-0", config.colorClass)}>
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-normal">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              actionType === 'restore' && 'bg-emerald-600 hover:bg-emerald-700 text-white border-none',
              actionType === 'suspend' && 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
              actionType === 'archive' && 'hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-600 border-amber-200'
            )}
          >
            {isLoading ? 'Processing...' : confirmLabel || config.defaultLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
