"use client";

import React, { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. Single Select Filter Component
interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export function SelectFilter({ label, value, onChange, options }: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 focus:outline-none text-zinc-900 dark:text-zinc-100 text-sm focus:ring-1 focus:ring-zinc-950"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// 2. Multi-Select Dropdown Filter
interface MultiSelectFilterProps {
  label: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  options: { label: string; value: string }[];
}

export function MultiSelectFilter({
  label,
  selectedValues,
  onChange,
  options,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-100 text-sm hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-950 min-w-[140px]"
      >
        <span className="truncate max-w-[100px]">
          {selectedValues.length === 0
            ? 'Select Multiple'
            : selectedValues.length === 1
              ? options.find((o) => o.value === selectedValues[0])?.label || selectedValues[0]
              : `${selectedValues.length} Selected`}
        </span>
        <div className="flex items-center gap-1">
          {selectedValues.length > 0 && (
            <X
              onClick={handleClear}
              className="h-3 w-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            />
          )}
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-lg z-40 max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                    isSelected
                      ? "text-zinc-900 dark:text-zinc-50 font-semibold bg-zinc-50 dark:bg-zinc-900/50"
                      : "text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// 3. Date Range Filter
interface DateRangeFilterProps {
  label: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
}

export function DateRangeFilter({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 focus:outline-none text-zinc-900 dark:text-zinc-100 text-sm"
        />
        <span className="text-zinc-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 focus:outline-none text-zinc-900 dark:text-zinc-100 text-sm"
        />
      </div>
    </div>
  );
}
