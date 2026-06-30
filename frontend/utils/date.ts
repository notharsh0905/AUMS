import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';
import { DATE_FORMATS } from '@/constants/common';

export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = DATE_FORMATS.DISPLAY_DATE
): string {
  if (!date) return '';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';
  return format(parsed, formatStr);
}

export function formatDateTime(
  date: string | Date | null | undefined,
  formatStr: string = DATE_FORMATS.DISPLAY_DATETIME
): string {
  return formatDate(date, formatStr);
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  if (!date) return '';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '';
  return formatDistanceToNow(parsed, { addSuffix: true });
}
