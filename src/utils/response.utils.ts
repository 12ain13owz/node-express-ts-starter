import { HelmetOptions } from 'helmet'

import { AppResponse } from '@/types/app.type'

export const createResponse = <T>(message: string, data?: T): AppResponse<T> => {
  return {
    message: message,
    timestamp: new Date().toISOString(),
    data: data,
  }
}

export const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.stoplight.io', 'unpkg.com'],
    },
  },
}
