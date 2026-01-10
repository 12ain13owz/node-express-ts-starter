import { LogLevel } from '@/const/logger.const'

export enum AppEnv {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export enum EnvFileName {
  DEVELOPMENT = '.env.development',
  PRODUCTION = '.env.production',
}

export type AppConfig = {
  PORT: number
  NODE_ENV: AppEnv
  BASE_URL: string
  LOG_LEVEL_CONSOLE: LogLevel
  LOG_LEVEL_FILE: LogLevel
  LOG_LEVEL_ERROR_FILE: LogLevel
}

export interface AppResponse<T> {
  message: string
  timestamp: string
  data?: T
}
