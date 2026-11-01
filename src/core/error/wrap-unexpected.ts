import { ERRORS, ErrorSeverity, HttpStatus } from '@/shared/constants'
import { AppError } from './app-error'

interface Cause {
  name: string
  message: string
}

const toCause = (error: unknown): Cause =>
  error instanceof Error
    ? { name: error.name, message: error.message }
    : { name: 'UnknownError', message: String(error) }

/**
 * Awaits `promise` and, if it rejects with something that isn't already an
 * `AppError`, rethrows a generic 500 `AppError` tagged with `operation` +
 * `metadata`, so the log says which call failed. The original error is
 * preserved as `metadata.cause` for logs.
 *
 * `errorHandler` already replaces any non-`AppError` message with a generic
 * one, so this is about log context, not the only guard against leaking raw
 * DB/driver messages. Some clients (Prisma) are lazy and only run once awaited
 * here; eager ones (mysql2, pg) have already started, so a synchronous throw
 * while building the call escapes this wrapper and is logged without context.
 * See AGENTS.md §4.
 */

export const wrapUnexpected = async <T>(
  promise: Promise<T>,
  operation: string,
  metadata?: Record<string, unknown>,
  message = ERRORS.INTERNAL_SERVER_ERROR
): Promise<T> => {
  try {
    return await promise
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorSeverity.ERROR)
      .withOperation(operation)
      .withMetadata({ ...metadata, cause: toCause(error) })
  }
}
