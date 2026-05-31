/* eslint-disable no-console */
/* eslint-disable no-process-env */
import chalk from 'chalk'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'

import type { LogLevel } from '@/shared/constants'
import { ERRORS, SUCCESS } from '@/shared/constants'
import type { AppConfig } from '@/shared/types'
import { AppEnv, EnvFileName } from '@/shared/types'

const resolveEnvFile = (): string => {
  const nodeEnv = (process.env.NODE_ENV as AppEnv | undefined) ?? AppEnv.DEVELOPMENT
  return nodeEnv === AppEnv.PRODUCTION ? EnvFileName.PRODUCTION : EnvFileName.DEVELOPMENT
}

const verifyEnvFile = (envFile: string): void => {
  const envPath = resolve(process.cwd(), envFile)

  if (!existsSync(envPath)) throw new Error(ERRORS.UTIL.notFound(envFile))
  console.info(chalk.greenBright(SUCCESS.CONFIG.load(envFile)))
}

const logLevel: LogLevel[] = ['error', 'warn', 'info', 'http', 'verbose', 'debug']
const envSchema: z.ZodType<AppConfig> = z.object({
  PORT: z.string().transform(Number),
  NODE_ENV: z.enum([AppEnv.DEVELOPMENT, AppEnv.PRODUCTION]),
  BASE_URL: z.string(),
  LOG_LEVEL_CONSOLE: z.enum(logLevel),
  LOG_LEVEL_FILE: z.enum(logLevel),
  LOG_LEVEL_ERROR_FILE: z.enum(logLevel),
})

const validateEnv = (): AppConfig => {
  const env = envSchema.safeParse(process.env)
  if (!env.success) {
    const errorMessages = env.error.issues
      .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')

    throw new Error(`\n${errorMessages}`)
  }

  return env.data
}

const initEnv = (): AppConfig => {
  const envFile = resolveEnvFile()

  try {
    verifyEnvFile(envFile)
    return validateEnv()
  } catch (error) {
    console.error(chalk.redBright(ERRORS.CONFIG.load(envFile)), error)
    process.exit(1)
  }
}

export const env = initEnv()
