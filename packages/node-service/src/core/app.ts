import config from '@sits/configuration'
import cookieParser from 'cookie-parser'
import type { Express, RequestHandler } from 'express'
import authMiddleware from '../middleware/auth/index.js'
import bodyParserMiddleware from '../middleware/body-parser/index.js'
import corsMiddleware from '../middleware/cors/index.js'
import helmetMiddleware from '../middleware/helmet/index.js'
import loggerMiddleware from '../middleware/logging/logger.js'
import contextMiddleware from '../middleware/request/context.js'
import correlationIdMiddleware from '../middleware/request/correlation-id.js'
import globalErrorHandlerMiddleware from '../middleware/global-error-handler/index.js'
import type { Logger } from '../utils/logger.js'

interface AppOptions {
  handlers?: RequestHandler
  logger?: Logger
}

/**
 * Creates and configures the Express application with all middleware
 */
const createApp = (app: Express, { handlers = () => {} }: AppOptions): Express => {
  // Middleware before handlers
  app.use(contextMiddleware())
  app.use(correlationIdMiddleware())
  app.use(loggerMiddleware())

  if (config.middleware.cors.enabled) {
    app.use(corsMiddleware(config))
  }

  if (config.middleware.helmet.enabled) {
    app.use(helmetMiddleware(config))
  }

  app.use(bodyParserMiddleware(app, config))
  app.use(cookieParser())
  app.use(authMiddleware())

  // User-provided handlers
  app.use(async (req, res, next) => {
    try {
      await handlers(req, res, next)
    } catch (error) {
      next(error)
    }
  })

  // Simple ping endpoint (always available)
  app.get('/ping', (req, res) => {
    res.json({ timestamp: new Date().toISOString() })
  })

  // 404 handler for unmatched routes
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      timestamp: new Date().toISOString(),
    })
  })

  // Global error handler
  app.use(globalErrorHandlerMiddleware())

  return app
}

export default createApp
