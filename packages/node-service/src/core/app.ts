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
  const config = getServiceConfig()

  // Middleware before handlers
  app.use(contextMiddleware() as any)
  app.use(correlationIdMiddleware() as any)
  app.use(loggerMiddleware() as any)

  if (config.service.middleware?.cors?.enabled) {
    app.use(corsMiddleware(config) as any)
  }

  if (config.service.middleware?.helmet?.enabled) {
    app.use(helmetMiddleware(config) as any)
  }

  app.use(bodyParserMiddleware(app, config) as any)
  app.use(cookieParser() as any)

  if (config.service.middleware?.auth?.enabled) {
    app.use(authMiddleware() as any)
  }

  // Health check endpoints
  createHealthEndpoints(app, config)

  // User-provided handlers
  app.use(async (req, res, next) => {
    try {
      await handlers(req, res, next)
    } catch (error) {
      next(error)
    }
  })

  // Middleware after handlers
  // We should add a middleware that will handle missing routes (missingRouteMiddleware)
  // We should add a middleware that will be used to handle errors (errorHandlerMiddleware)

  return app
}

export default createApp
