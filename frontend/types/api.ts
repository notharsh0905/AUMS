export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T = unknown> extends ApiResponse<T> {
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
  details?: unknown;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiValidationErrorResponse extends ApiErrorResponse {
  errors?: ValidationErrorDetail[];
}
