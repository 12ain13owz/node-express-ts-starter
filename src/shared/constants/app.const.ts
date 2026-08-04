import type { HelmetOptions } from 'helmet'

export const APP_NAME = 'Node Starter'

export const APP_GENERIC = {
  serverListening: (baseUrl: string) => `Server listening at ${baseUrl}`,
}

export const HELMET_OPTIONS: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      connectSrc: ["'self'", 'cdn.jsdelivr.net'],
    },
  },
}
