import type { Express } from 'express'
import type { Server } from 'http'

import { getEnv } from '@/config'
import { APP_GENERIC } from '@/const/app.const'

import { logger } from './logger.utils'

const env = getEnv()
let serverInstance: Server | null = null

export const startServer = (app: Express, port: number): void => {
  serverInstance = app.listen(port, () =>
    logger.info(APP_GENERIC.serverListening(env.BASE_URL, port))
  )

  process.on('unhandledRejection', handleFatalError)
  process.on('uncaughtException', handleFatalError)

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

export const handleFatalError = (error: unknown): void => {
  logger.error(error)
  shutdown(1)
}

export const shutdown = (exitCode = 0): void => {
  if (serverInstance) serverInstance.close(() => process.exit(exitCode))
  else process.exit(exitCode)
}
