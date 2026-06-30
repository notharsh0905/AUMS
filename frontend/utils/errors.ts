import { ValidationErrorDetail } from '@/types/api';

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ApiError extends AppError {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  public errors: ValidationErrorDetail[];

  constructor(
    message: string,
    status = 422,
    code = 'VALIDATION_ERROR',
    errors: ValidationErrorDetail[] = []
  ) {
    super(message, status, code);
    this.errors = errors;
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection failure. Please check your internet connection.') {
    super(message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message = 'Session expired or unauthorized. Please log in again.',
    code = 'UNAUTHORIZED'
  ) {
    super(message, 401, code);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'You do not have permission to access this resource.', code = 'FORBIDDEN') {
    super(message, 403, code);
  }
}

export class InvalidCredentialsError extends ApiError {
  constructor(message = 'Invalid email or password.', code = 'INVALID_CREDENTIALS') {
    super(message, 401, code);
  }
}

export class SessionExpiredError extends ApiError {
  constructor(
    message = 'Your session has expired. Please log in again.',
    code = 'SESSION_EXPIRED'
  ) {
    super(message, 401, code);
  }
}
