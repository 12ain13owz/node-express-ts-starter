import { z } from 'zod'
import { LOG_LEVELS } from '@/shared/constants'
import type { LogLevel } from '@/shared/constants'
import { AppEnv } from '@/shared/types'
import type { EnvConfig } from './env.type'

const logLevel = Object.keys(LOG_LEVELS) as LogLevel[]

export const envSchema: z.ZodType<EnvConfig> = z.object({
  PORT: z.string().transform(Number),
  NODE_ENV: z.enum([AppEnv.DEVELOPMENT, AppEnv.PRODUCTION]),
  BASE_URL: z.string(),
  LOG_LEVEL_CONSOLE: z.enum(logLevel),
  LOG_LEVEL_FILE: z.enum(logLevel),
  LOG_LEVEL_ERROR_FILE: z.enum(logLevel),
})
