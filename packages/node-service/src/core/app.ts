import config from '@sits/configuration'
import cookieParser from 'cookie-parser'
import type { Express, Router } from 'express'
import authMiddleware from '../middleware/auth/index.js'
import bodyParserMiddleware from '../middleware/body-parser/index.js'
import corsMiddleware from '../middleware/cors/index.js'
import createHealthEndpoints from '../middleware/health/index.js'
import helmetMiddleware from '../middleware/helmet/index.js'
import loggerMiddleware from '../middleware/logging/logger.js'
import contextMiddleware from '../middleware/request/context.js'
import correlationIdMiddleware from '../middleware/request/correlation-id.js'
import globalErrorHandlerMiddleware from '../middleware/global-error-handler/index.js'
import type { Logger } from '../utils/logger.js'
import { getServiceConfig } from './config.js'

interface AppOptions {
  handlers: Router
  logger?: Logger
}

/**
 * Creates and configures the Express application with all middleware
 */
const createApp = (app: Express, { handlers }: AppOptions): Express => {
  const serviceConfig = getServiceConfig()

  // Middleware before handlers
  app.use(contextMiddleware() as any)
  app.use(correlationIdMiddleware() as any)
  app.use(loggerMiddleware() as any)

  if (serviceConfig.core?.cors?.enabled) {
    app.use(corsMiddleware(serviceConfig) as any)
  }

  if (serviceConfig.nodeService?.middleware?.helmet?.enabled) {
    app.use(helmetMiddleware(serviceConfig) as any)
  }

  app.use(bodyParserMiddleware(app, serviceConfig) as any)
  app.use(cookieParser() as any)

  // Check if authentication is configured in core.auth
  if (config.core?.auth && Object.keys(config.core.auth.strategies || {}).length > 0) {
    app.use(authMiddleware() as any)
  }

  // Health check endpoints
  createHealthEndpoints(app, serviceConfig)

  // User-provided handlers
  app.use(async (req, res, next) => {
    try {
      await handlers(req, res, next)
    } catch (error) {
      next(error)
    }
  })

  // Middleware after handlers

  // 404 handler for unmatched routes
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      timestamp: new Date().toISOString(),
    })
  })

  // Global error handler
  app.use(globalErrorHandlerMiddleware as any)

  return app
}

export default createApp
