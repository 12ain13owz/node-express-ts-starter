import { env } from '@/core/config'
import { logger } from '@/core/logger'
import { APP_GENERIC } from '@/shared/constants'
import type { Express } from 'express'
import type { Server } from 'http'

let serverInstance: Server | null = null

export const startServer = (app: Express, port: number): void => {
  serverInstance = app.listen(port, () =>
    logger.info(APP_GENERIC.serverListening(env.BASE_URL), { source: false })
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
  if (serverInstance) {
    serverInstance.close(() => process.exit(exitCode))
  } else {
    process.exit(exitCode)
  }
}
