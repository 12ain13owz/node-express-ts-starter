import { Request } from 'express'

import { HttpStatus } from '@/const/http-status.const'
import { ErrorSeverity } from '@/const/logger.const'
import { EndpointContext, ErrorContext } from '@/types/error.type'

import { logger } from './logger.utils'

export class AppError extends Error {
  constructor(
    message: string,
    public status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public severity: ErrorSeverity = ErrorSeverity.ERROR,
    public context: ErrorContext = {}
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  addEndpointContext(req: Request): this {
    const endpoint: EndpointContext = {
      method: req.method,
      url: req.originalUrl,
    }

    if (req.params && Object.keys(req.params).length > 0) endpoint.params = { ...req.params }
    if (req.query && Object.keys(req.query).length > 0) endpoint.query = { ...req.query }

    const body = req.body as Record<string, unknown>
    if (req.body && Object.keys(body).length > 0) endpoint.body = { ...body }

    this.context.endpoint = endpoint
    return this
  }

  addOperationName(operationName: string): this {
    this.context.operationName = operationName
    return this
  }

  addAdditionalData(additionalData: Record<string, unknown>): this {
    this.context.additionalData = additionalData
    return this
  }
}

export class ErrorLogger {
  private static formatErrorLog(error: AppError | Error, additionalData?: Record<string, unknown>) {
    const baseLog = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }

    if (error instanceof AppError)
      return {
        ...baseLog,
        status: error.status,
        severity: error.severity,
        ...error.context,
        ...additionalData,
      }

    return {
      ...baseLog,
      status: 500,
      severity: ErrorSeverity.ERROR,
      ...additionalData,
    }
  }

  static log(error: AppError | Error, additionalContext?: Partial<ErrorContext>) {
    const errorLog = this.formatErrorLog(error, additionalContext)
    const level = error instanceof AppError ? error.severity : ('error' as ErrorSeverity)
    const logMethods = {
      [ErrorSeverity.INFO]: logger.info,
      [ErrorSeverity.WARN]: logger.warn,
      [ErrorSeverity.HTTP]: logger.http,
      [ErrorSeverity.VERBOSE]: logger.verbose,
      [ErrorSeverity.DEBUG]: logger.debug,
      [ErrorSeverity.ERROR]: logger.error,
    }

    // eslint-disable-next-line security/detect-object-injection
    const logMethod = logMethods[level] || logger.error
    logMethod([errorLog])

    return errorLog
  }
}
