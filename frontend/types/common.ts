export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

export type UUID = string;
export type ID = string | number;

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
