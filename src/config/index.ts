/* eslint-disable no-console */
/* eslint-disable no-process-env */
import chalk from 'chalk'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'

import { LogLevel } from '@/const/logger.const'
import { ERRORS, SUCCESS } from '@/const/message.const'
import { AppConfig, AppEnv, EnvFileName } from '@/types/app.type'

const loadEnvFile = (): void => {
  const nodeEnv = (process.env.NODE_ENV as AppEnv | undefined) ?? AppEnv.DEVELOPMENT
  const envFile = nodeEnv === AppEnv.PRODUCTION ? EnvFileName.PRODUCTION : EnvFileName.DEVELOPMENT
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
    const errorMessage = env.error.issues.map((issue) => issue.message).join(', ')
    throw new Error(errorMessage)
  }

  return env.data
}

let env: AppConfig

const initEnv = (): AppConfig => {
  loadEnvFile()
  return validateEnv()
}

export const getEnv = (): AppConfig => {
  if (env) return env

  try {
    env = initEnv()
    return env
  } catch (error) {
    console.error(chalk.redBright(error))
    process.exit(1)
  }
}
