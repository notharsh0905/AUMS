"use client";

import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Check } from 'lucide-react';

interface BaseFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}

// 1. Text / Email / Password Input Component
interface FormInputProps extends BaseFieldProps, Omit<React.ComponentProps<typeof Input>, 'name'> {
  type?: 'text' | 'email' | 'password' | 'number';
}

export function FormInput({ name, label, description, required = false, type = 'text', className, ...props }: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label htmlFor={name} className="flex items-center gap-0.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
        {...register(name, { required })}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

// 2. Text Area Component
interface FormTextAreaProps extends BaseFieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {}

export function FormTextArea({ name, label, description, required = false, className, ...props }: FormTextAreaProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label htmlFor={name} className="flex items-center gap-0.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <textarea
        id={name}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:ring-zinc-300 focus-visible:ring-zinc-950",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...register(name, { required })}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

// 3. Dropdown Selection Component
interface FormSelectProps extends BaseFieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  options: { label: string; value: string }[];
}

export function FormSelect({ name, label, description, required = false, options, className, ...props }: FormSelectProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label htmlFor={name} className="flex items-center gap-0.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative w-full">
        <select
          id={name}
          className={cn(
            "w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 focus:outline-none text-zinc-900 dark:text-zinc-100 text-sm focus:ring-1 focus:ring-zinc-950 appearance-none",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...register(name, { required })}
          {...props}
        >
          <option value="">Select option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {description && !error && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

// 4. Boolean Switch Switch Component (styled slider)
export function FormSwitch({ name, label, description, required = false }: BaseFieldProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col gap-0.5">
          {label && (
            <Label htmlFor={name} className="flex items-center gap-0.5">
              <span>{label}</span>
              {required && <span className="text-red-500">*</span>}
            </Label>
          )}
          {description && (
            <p className="text-xs text-zinc-455 dark:text-zinc-500">{description}</p>
          )}
        </div>

        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <button
              type="button"
              role="switch"
              id={name}
              aria-checked={field.value}
              onClick={() => field.onChange(!field.value)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:ring-offset-2",
                field.value ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-200 dark:bg-zinc-800"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-zinc-950 shadow-xs ring-0 transition duration-200 ease-in-out",
                  field.value ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          )}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

// 5. Date Picker Component (styled native calendar picker input)
interface FormDatePickerProps extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {}

export function FormDatePicker({ name, label, description, required = false, className, ...props }: FormDatePickerProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label htmlFor={name} className="flex items-center gap-0.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <input
        type="date"
        id={name}
        className={cn(
          "flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:ring-zinc-300 focus-visible:ring-zinc-950",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...register(name, { required })}
        {...props}
      />
      {description && !error && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

// 6. Multi-select Form Dropdown Field
interface FormMultiSelectProps extends BaseFieldProps {
  options: { label: string; value: string }[];
}

export function FormMultiSelect({ name, label, description, required = false, options }: FormMultiSelectProps) {
  const { control, formState: { errors } } = useFormContext();
  const [open, setOpen] = useState(false);
  const error = errors[name];

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      {label && (
        <Label className="flex items-center gap-0.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const selected: string[] = field.value || [];

          const toggleSelection = (val: string) => {
            if (selected.includes(val)) {
              field.onChange(selected.filter((v) => v !== val));
            } else {
              field.onChange([...selected, val]);
            }
          };

          return (
            <>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                  "flex items-center justify-between w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-900 dark:text-zinc-100 text-sm hover:bg-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-950 text-left min-h-9",
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <span className="truncate max-w-[90%]">
                  {selected.length === 0
                    ? 'Select options'
                    : selected.length === 1
                      ? options.find((o) => o.value === selected[0])?.label || selected[0]
                      : `${selected.length} options selected`}
                </span>
                <ChevronDown className="h-4 w-4 text-zinc-500 flex-shrink-0" />
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                  <div className="absolute top-full mt-1.5 left-0 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-lg z-40 max-h-60 overflow-y-auto">
                    {options.map((opt) => {
                      const isSelected = selected.includes(opt.value);
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => toggleSelection(opt.value)}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                            isSelected
                              ? "text-zinc-900 dark:text-zinc-50 font-semibold bg-zinc-50 dark:bg-zinc-900/50"
                              : "text-zinc-600 dark:text-zinc-400"
                          )}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          );
        }}
      />

      {description && !error && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500" role="alert">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
