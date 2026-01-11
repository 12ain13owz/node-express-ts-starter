import { NextFunction, Request, Response } from 'express'

import { env } from '@/config'
import { HttpStatus } from '@/const/http-status.const'
import { ERRORS } from '@/const/message.const'
import { AppEnv } from '@/types/app.type'
import { AppError, ErrorLogger } from '@/utils/error-handling.utils'
import { logger } from '@/utils/logger.utils'
import { createResponse } from '@/utils/response.utils'

export const errorHandler = async (
  error: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    ErrorLogger.log(error)

    const status = error instanceof AppError ? error.status : HttpStatus.INTERNAL_SERVER_ERROR
    const message = error.message ? error.message : ERRORS.GENERIC.INTERNAL_SERVER_ERROR
    const data = env.NODE_ENV === AppEnv.DEVELOPMENT ? error : undefined
    const response = createResponse(message, data)

    res.status(status).json(response)
  } catch (error) {
    logger.error(error)
    const data = env.NODE_ENV === AppEnv.DEVELOPMENT ? error : undefined
    const response = createResponse(ERRORS.GENERIC.INTERNAL_SERVER_ERROR, data)

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
  }
}
