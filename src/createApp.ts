import cookieParser from 'cookie-parser'
import express, { Express } from 'express'
import type { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import authMiddleware from './middleware/auth'
import contextMiddleware from './middleware/context'
import correlationIdMiddleware from './middleware/correlationId'
import corsMiddleware from './middleware/cors'
import loggerMiddleware from './middleware/logger'
import type { Logger } from './utils/logger'

interface ServiceOptions {
  handlers?: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
  logger?: Logger
}

const createApp = async (app: Express, { handlers = () => {} }: ServiceOptions) => {
  app.use(express.json())
  app.use(helmet())
  app.use(cookieParser())
  app.use(contextMiddleware())
  app.use(authMiddleware())
  app.use(correlationIdMiddleware())
  app.use(loggerMiddleware())
  app.use(corsMiddleware())

  app.get('/ping', (req, res) => {
    res.send({ timestamp: new Date().toISOString() })
  })

  app.use(async (req, res, next) => {
    try {
      await handlers(req, res, next)
    } catch (error) {
      next(error)
    }
  })

  return app
}

export default createApp
