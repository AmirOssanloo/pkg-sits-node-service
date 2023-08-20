interface LogData {
  correlation_id?: string
  meta?: Record<string, any>
  payload?: Record<string, any>
}

interface ErrorData extends LogData {
  error?: Error | string | unknown
}

export interface Logger {
  info: (message: string, data?: LogData) => void
  error: (message: string, data?: ErrorData) => void
}

const logger: Logger = {
  info: (message: string, data?: LogData) => {
    const pre = '\x1b[36mINFO |\x1b[0m'

    if (data) {
      console.log(pre, message, data)
    } else {
      console.log(pre, message)
    }
  },
  error: (message: string, data?: ErrorData) => {
    const pre = '\x1b[31mERROR |\x1b[0m'

    if (data) {
      console.error(pre, message, data)
    } else {
      console.error(pre, message)
    }
  },
}

export default logger
