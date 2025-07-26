import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import type { Express } from 'express'
import helmet from 'helmet'
import authMiddleware from '../middleware/auth/index.js'
import loggerMiddleware from '../middleware/logging/logger.js'
import contextMiddleware from '../middleware/request/context.js'
import correlationIdMiddleware from '../middleware/request/correlation-id.js'
import type { Logger } from '../utils/logger.js'
import { getServiceConfig } from './config.js'

interface ServiceOptions {
  logger?: Logger
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createApp = (app: Express, _options: ServiceOptions): Express => {
  const config = getServiceConfig()

  // Apply core middleware
  app.use(contextMiddleware() as any)
  app.use(correlationIdMiddleware() as any)
  app.use(loggerMiddleware() as any)

  // Apply configurable middleware

  // CORS
  if (config.service.middleware?.cors?.enabled !== false) {
    app.use(
      cors({
        origin: config.service.middleware?.cors?.origin ?? true,
        credentials: config.service.middleware?.cors?.credentials ?? true,
        methods: config.service.middleware?.cors?.methods ?? ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: config.service.middleware?.cors?.allowedHeaders,
        exposedHeaders: config.service.middleware?.cors?.exposedHeaders,
        maxAge: config.service.middleware?.cors?.maxAge,
        preflightContinue: config.service.middleware?.cors?.preflightContinue ?? false,
        optionsSuccessStatus: config.service.middleware?.cors?.optionsSuccessStatus ?? 204,
      })
    )
  }

  // Body parsing
  app.use(
    express.json({
      limit: config.service.middleware?.bodyParser?.json?.limit ?? '10mb',
      strict: config.service.middleware?.bodyParser?.json?.strict ?? true,
      type: config.service.middleware?.bodyParser?.json?.type ?? 'application/json',
    })
  )

  app.use(
    express.urlencoded({
      extended: config.service.middleware?.bodyParser?.urlencoded?.extended ?? true,
      limit: config.service.middleware?.bodyParser?.urlencoded?.limit ?? '10mb',
      parameterLimit: config.service.middleware?.bodyParser?.urlencoded?.parameterLimit ?? 1000,
    })
  )

  // Helmet
  if (config.service.middleware?.helmet?.enabled !== false) {
    app.use(
      helmet({
        contentSecurityPolicy: config.service.middleware?.helmet?.contentSecurityPolicy ?? false,
        crossOriginEmbedderPolicy: config.service.middleware?.helmet?.crossOriginEmbedderPolicy ?? true,
        crossOriginOpenerPolicy: config.service.middleware?.helmet?.crossOriginOpenerPolicy ?? true,
        crossOriginResourcePolicy: config.service.middleware?.helmet?.crossOriginResourcePolicy ?? true,
        dnsPrefetchControl: config.service.middleware?.helmet?.dnsPrefetchControl ?? true,
        frameguard: config.service.middleware?.helmet?.frameguard ?? true,
        hidePoweredBy: config.service.middleware?.helmet?.hidePoweredBy ?? true,
        hsts: config.service.middleware?.helmet?.hsts ?? true,
        ieNoOpen: config.service.middleware?.helmet?.ieNoOpen ?? true,
        noSniff: config.service.middleware?.helmet?.noSniff ?? true,
        originAgentCluster: config.service.middleware?.helmet?.originAgentCluster ?? true,
        permittedCrossDomainPolicies: config.service.middleware?.helmet?.permittedCrossDomainPolicies ?? false,
        referrerPolicy: config.service.middleware?.helmet?.referrerPolicy ?? true,
        xssFilter: config.service.middleware?.helmet?.xssFilter ?? true,
      } as any)
    )
  }

  app.use(cookieParser() as any)

  // Auth middleware (if enabled)
  if (config.service.middleware?.auth?.enabled) {
    app.use(authMiddleware() as any)
  }

  // Default ping route
  app.get('/ping', (req, res) => {
    res.json({ timestamp: new Date().toISOString() })
  })

  // Health check route (if enabled)
  if (config.service.health.enabled) {
    app.get(config.service.health.path, async (req, res) => {
      const startTime = Date.now()
      const checks: Record<string, boolean> = {}

      // Run configured health checks
      for (const check of config.service.health.checks) {
        try {
          const timeoutPromise = new Promise<boolean>((resolve, reject) =>
            setTimeout(
              () => reject(new Error('Health check timeout')),
              config.service.health.timeout
            )
          )
          checks[check.name] = await Promise.race([check.check(), timeoutPromise])
        } catch {
          checks[check.name] = false
        }
      }

      const allHealthy = Object.values(checks).every((status) => status)
      const response = {
        status: allHealthy ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        service: config.service.name,
        version: config.service.version,
        uptime: process.uptime(),
        responseTime: Date.now() - startTime,
        checks,
      }

      res.status(allHealthy ? 200 : 503).json(response)
    })
  }

  return app
}

export default createApp
