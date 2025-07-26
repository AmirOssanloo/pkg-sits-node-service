import { getConfigValue } from '../core/config.js'

interface LogData {
  correlation_id?: string
  meta?: Record<string, any>
  payload?: Record<string, any>
}

interface ErrorData extends LogData {
  error?: Error | string | unknown
}

export interface Logger {
  debug: (message: string, data?: LogData) => void
  info: (message: string, data?: LogData) => void
  warn: (message: string, data?: LogData) => void
  error: (message: string, data?: ErrorData) => void
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const shouldLog = (level: LogLevel): boolean => {
  const configuredLevel = getConfigValue('service.logging.level', 'info') as LogLevel
  const silent = getConfigValue('service.logging.silent', false)

  if (silent) return false

  return logLevels[level] >= logLevels[configuredLevel]
}

const formatLog = (level: string, message: string, data?: LogData | ErrorData): void => {
  const format = getConfigValue('service.logging.format', 'json')
  const timestamp = new Date().toISOString()

  if (format === 'json') {
    const logEntry = {
      timestamp,
      level,
      message,
      ...data,
    }
    console.log(JSON.stringify(logEntry))
  } else {
    // Pretty format
    const colors = {
      debug: '\x1b[37m',
      info: '\x1b[36m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    }
    const pre = `${colors[level as LogLevel]}${level.toUpperCase().padEnd(5)} |\x1b[0m`

    if (data) {
      console.log(pre, message, data)
    } else {
      console.log(pre, message)
    }
  }
}

const logger: Logger = {
  debug: (message: string, data?: LogData) => {
    if (shouldLog('debug')) {
      formatLog('debug', message, data)
    }
  },
  info: (message: string, data?: LogData) => {
    if (shouldLog('info')) {
      formatLog('info', message, data)
    }
  },
  warn: (message: string, data?: LogData) => {
    if (shouldLog('warn')) {
      formatLog('warn', message, data)
    }
  },
  error: (message: string, data?: ErrorData) => {
    if (shouldLog('error')) {
      formatLog('error', message, data)
    }
  },
}

export default logger
