import rateLimit from 'express-rate-limit'

import { HttpStatus } from '@/const/http-status.const'
import { ERRORS } from '@/const/message.const'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: ERRORS.GENERIC.TOO_MANY_REQUESTS,
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
})
