import cookieParser from 'cookie-parser'
import express from 'express'
import type { Express } from 'express'
import helmet from 'helmet'
import { authMiddleware } from './middleware/auth/index.js'
import contextMiddleware from './middleware/context.js'
import correlationIdMiddleware from './middleware/correlationId.js'
import corsMiddleware from './middleware/cors.js'
import loggerMiddleware from './middleware/logger.js'
import type { Logger } from './utils/logger.js'

interface ServiceOptions {
  logger?: Logger
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createApp = (app: Express, _options: ServiceOptions): Express => {
  // Apply middleware
  app.use(corsMiddleware())
  app.use(express.json())
  app.use(helmet())
  app.use(cookieParser())
  app.use(contextMiddleware())
  app.use(authMiddleware())
  app.use(correlationIdMiddleware())
  app.use(loggerMiddleware())

  // Default health check route
  app.get('/ping', (req, res) => {
    res.json({ timestamp: new Date().toISOString() })
  })

  return app
}

export default createApp
