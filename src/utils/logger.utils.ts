import dayjs from 'dayjs'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createLogger, format, transports } from 'winston'

import { env } from '@/config'
import { AnsiColors, LOG_LEVEL_COLORS, LOG_LEVELS, DisplayLevel } from '@/const/logger.const'

// # ==================== File Transport Utilities ====================

/**
 * Creates log directory structure if it doesn't exist
 * Structure: logs/YYYY/MM/
 */
const ensureLogDirectory = (): string => {
  const now = dayjs()
  const year = now.format('YYYY')
  const month = now.format('MM')
  const logDir = join(process.cwd(), 'logs', year, month)

  if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true })
  return logDir
}

/**
 * Generates log filename based on current date and level
 * Format: YYYY-MM-DD.log or YYYY-MM-DD.error.log
 */
const getLogFilename = (level?: string): string => {
  const date = dayjs().format('YYYY-MM-DD')
  return level === 'error' ? `${date}.error.log` : `${date}.log`
}

/**
 * Gets full path for log file
 */
const getLogFilePath = (level?: string): string => {
  const logDir = ensureLogDirectory()
  const filename = getLogFilename(level)
  return join(logDir, filename)
}

// # ==================== Color Utilities ====================

/**
 * Applys text with ANSI color codes for terminal output
 */
const applyColor = (text: unknown, color: AnsiColors): string => {
  return `\x1b[${color}m${String(text)}\x1b[0m`
}

/**
 * Formats log level with appropriate color and padding
 */
const formatLogLevel = (level: string): string => {
  const normalizedLevel = level.toUpperCase()
  const colorCode = LOG_LEVEL_COLORS[normalizedLevel as DisplayLevel] ?? AnsiColors.OTHER
  const colorLevel = applyColor(normalizedLevel.padEnd(5), colorCode)
  return colorLevel
}

// # ==================== Value Formatting ====================

/**
 * Formats primitive values (string, number, boolean, null, undefined, function)
 */
const formatPrimitiveValue = (value: unknown): string => {
  // ! Handle null and undefined first
  if (value === null) return applyColor('null', AnsiColors.NULL)
  if (value === undefined) return applyColor('undefined', AnsiColors.UNDEFINED)

  switch (typeof value) {
    case 'string': {
      // * Check if string is used as a separator/header (contains only \n, =, spaces, and uppercase letters)
      const isSeparator = /^[\n\r\s=\-_A-Z0-9.]+$/.test(value) && /[\n\r]/.test(value)

      // ? Return raw string without quotes for separators
      if (isSeparator) return value

      return applyColor(`"${value}"`, AnsiColors.STRING)
    }
    case 'number':
      return applyColor(value, AnsiColors.NUMBER)
    case 'boolean':
      return applyColor(value, AnsiColors.BOOLEAN)
    case 'function':
      return applyColor(value, AnsiColors.FUNCTION)
    default:
      return applyColor(value, AnsiColors.OTHER)
  }
}

/**
 * Formats Date objects as readable timestamps
 */
const formatDate = (date: Date): string => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  return applyColor(formattedDate, AnsiColors.DATE)
}

/**
 * Formats arrays with smart layout:
 * - Single line for ≤5 primitive items
 * - Multi-line for complex or longer arrays
 */
const formatArrayValue = (arr: unknown[], indentLevel: number = 0): string => {
  if (arr.length === 0) return '[]'

  const indent = '  '.repeat(indentLevel)
  const nextIndent = '  '.repeat(indentLevel + 1)

  // ? Check if array contains only primitives
  const isPrimitiveArray = arr.every(
    (item) =>
      item === null || item === undefined || ['string', 'number', 'boolean'].includes(typeof item)
  )

  // * Use compact format for small primitive arrays
  if (isPrimitiveArray && arr.length <= 5) {
    const items = arr.map((item) => formatValue(item, indentLevel + 1)).join(', ')
    return `[${items}]`
  }

  // * Use multi-line format for complex arrays
  const items = arr.map((item) => {
    const formattedItem = formatValue(item, indentLevel + 1)
    return `${nextIndent}${formattedItem}`
  })

  return `[\n${items.join(',\n')}\n${indent}]`
}

/**
 * Formats objects with proper indentation and line breaks
 */
const formatObjectValue = (obj: Record<string, unknown>, indentLevel: number = 0): string => {
  const entries = Object.entries(obj)
  if (entries.length === 0) return '{}'

  const indent = '  '.repeat(indentLevel)
  const nextIndent = '  '.repeat(indentLevel + 1)

  const formattedEntries = entries.map(([key, value]) => {
    const coloredKey = applyColor(key, AnsiColors.FIELD)
    const formattedValue = formatValue(value, indentLevel + 1)
    return `${nextIndent}${coloredKey}: ${formattedValue}`
  })

  return `{\n${formattedEntries.join(',\n')}\n${indent}}`
}

/**
 * Main value formatter - delegates to specific formatters based on type
 */
const formatValue = (value: unknown, indentLevel: number = 0): string => {
  // ! Check Date first (before Array check, since Date is also an object)
  if (value instanceof Date) return formatDate(value)
  if (Array.isArray(value)) return formatArrayValue(value, indentLevel)
  if (typeof value === 'object' && value !== null)
    return formatObjectValue(value as Record<string, unknown>, indentLevel)

  return formatPrimitiveValue(value)
}

// # ==================== Message Formatting ====================

/**
 * Formats log messages with special handling for arrays of multiple values
 */
const formatLogMessage = (message: unknown): string => {
  if (Array.isArray(message)) {
    // ? Handle empty array
    if (message.length === 0) return '[]'

    // * Single item doesn't need index
    if (message.length === 1) return formatValue(message[0], 0)

    // TODO: Multiple items: show each with index on new line
    const formattedItems = message.map((item, index) => {
      const itemNumber = applyColor(`[${index}]`, AnsiColors.OTHER)
      const formattedValue = formatValue(item, 1)
      return `  ${itemNumber} ${formattedValue}`
    })

    return `\n${formattedItems.join('\n')}`
  }

  return formatValue(message, 0)
}

// # ==================== Winston Custom Format ====================

/**
 * Custom Winston format that combines timestamp, level, and formatted message
 */
const customLogFormat = format.printf((info) => {
  const timestamp = applyColor(`[${dayjs().format('HH:mm:ss.SSS')}]`, AnsiColors.OTHER)
  const level = formatLogLevel(info.level)
  const message = formatLogMessage(info.message)

  return `${timestamp} ${level} ${message}`
})

/**
 * File format without colors (plain text)
 * Format: [timestamp] LEVEL message
 */
const fileLogFormat = format.printf((info) => {
  const timestamp = `[${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')}]`
  const level = info.level.toUpperCase().padEnd(7)

  // ? Convert message to plain string without colors
  let message = ''
  if (Array.isArray(info.message)) message = JSON.stringify(info.message, null, 2)
  else if (typeof info.message === 'object') message = JSON.stringify(info.message, null, 2)
  else message = String(info.message as unknown)

  return `${timestamp} ${level} ${message}`
})

// # ==================== Logger Instance ====================

/**
 * Configured Winston logger instance with custom formatting
 * Logs to both console (with colors) and files (plain text)
 *
 * File structure:
 * - logs/YYYY/MM/YYYY-MM-DD.log - All logs (info and above)
 * - logs/YYYY/MM/YYYY-MM-DD.error.log - Error logs only
 *
 * @example
 * logger.info('Simple message')
 * logger.info([value1, value2, value3])
 * logger.error({ error: 'message', code: 500 })
 */
export const logger = createLogger({
  levels: LOG_LEVELS,
  transports: [
    // * Console transport with colors
    new transports.Console({
      format: customLogFormat,
      level: env.LOG_LEVEL_CONSOLE,
    }),

    // * File transport for info logs
    new transports.File({
      filename: getLogFilePath(),
      format: fileLogFormat,
      level: env.LOG_LEVEL_FILE,
    }),

    // ! File transport for error logs only
    new transports.File({
      filename: getLogFilePath('error'),
      format: fileLogFormat,
      level: env.LOG_LEVEL_ERROR_FILE,
    }),
  ],
})
