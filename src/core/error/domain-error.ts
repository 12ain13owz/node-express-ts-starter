import { ERRORS, ErrorSeverity, HttpStatus } from '@/shared/constants'
import { AppError } from './app-error'

type Meta = Record<string, unknown>

const build = <T extends AppError>(error: T, metadata?: Meta): T =>
  metadata ? error.withMetadata(metadata) : error

export class NotFoundError extends AppError {
  constructor(resource: string, metadata?: Meta) {
    super(ERRORS.UTIL.notFound(resource), HttpStatus.NOT_FOUND, ErrorSeverity.WARN)
    build(this, metadata)
  }
}

export class ConflictError extends AppError {
  constructor(message: string, metadata?: Meta) {
    super(message, HttpStatus.CONFLICT, ErrorSeverity.WARN)
    build(this, metadata)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, metadata?: Meta) {
    super(message, HttpStatus.UNAUTHORIZED, ErrorSeverity.WARN)
    build(this, metadata)
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, metadata?: Meta) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, ErrorSeverity.WARN)
    build(this, metadata)
  }
}
