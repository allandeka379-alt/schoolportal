/**
 * Domain error taxonomy.
 *
 * Every expected failure gets a code. Errors that leak out of the API are
 * shaped like:
 *    { code, message, details?, correlationId }
 *
 * Unexpected errors are mapped to INTERNAL and the details are logged but not
 * returned to the client. See apps/api/src/common/exception-filter.ts.
 */
export type ErrorCode =
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'UNAUTHENTICATED'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'DOMAIN_RULE'
  | 'PAYMENT_DECLINED'
  | 'SLIP_VERIFICATION_FAILED'
  | 'INTERNAL';

export class DomainError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message = 'Validation failed', details?: Record<string, unknown>) {
    super('VALIDATION', message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', id ? `${resource} ${id} not found` : `${resource} not found`, { resource, id });
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'Not permitted', details?: Record<string, unknown>) {
    super('FORBIDDEN', message, details);
    this.name = 'ForbiddenError';
  }
}

export class UnauthenticatedError extends DomainError {
  constructor(message = 'Authentication required') {
    super('UNAUTHENTICATED', message);
    this.name = 'UnauthenticatedError';
  }
}

export class ConflictError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFLICT', message, details);
    this.name = 'ConflictError';
  }
}

export class DomainRuleError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('DOMAIN_RULE', message, details);
    this.name = 'DomainRuleError';
  }
}

export class SlipVerificationError extends DomainError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super('SLIP_VERIFICATION_FAILED', reason, details);
    this.name = 'SlipVerificationError';
  }
}

export interface SerialisedError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  correlationId?: string;
}

export function serialiseError(err: unknown, correlationId?: string): SerialisedError {
  if (err instanceof DomainError) {
    return { code: err.code, message: err.message, details: err.details, correlationId };
  }
  return {
    code: 'INTERNAL',
    message: 'An unexpected error occurred.',
    correlationId,
  };
}
