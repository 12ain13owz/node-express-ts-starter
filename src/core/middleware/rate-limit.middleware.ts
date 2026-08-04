import rateLimit from 'express-rate-limit'
import { ERRORS, HttpStatus } from '@/shared/constants'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: ERRORS.GENERIC.TOO_MANY_REQUESTS,
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
})
