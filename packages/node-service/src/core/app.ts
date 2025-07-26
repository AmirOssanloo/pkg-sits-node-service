import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import type { Express } from 'express'
import helmet from 'helmet'
import authMiddleware from '../middleware/auth/index.js'
import contextMiddleware from '../middleware/logging/context.js'
import correlationIdMiddleware from '../middleware/logging/correlation-id.js'
import loggerMiddleware from '../middleware/logging/logger.js'
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
  if (config.service.middleware.cors.enabled) {
    app.use(
      cors({
        origin: config.service.middleware.cors.origin as any,
        credentials: config.service.middleware.cors.credentials,
        methods: config.service.middleware.cors.methods,
        allowedHeaders: config.service.middleware.cors.allowedHeaders,
        exposedHeaders: config.service.middleware.cors.exposedHeaders,
        maxAge: config.service.middleware.cors.maxAge,
        preflightContinue: config.service.middleware.cors.preflightContinue,
        optionsSuccessStatus: config.service.middleware.cors.optionsSuccessStatus,
      })
    )
  }

  // Body parsing
  app.use(
    express.json({
      limit: config.service.middleware.bodyParser.json.limit,
      strict: config.service.middleware.bodyParser.json.strict,
      type: config.service.middleware.bodyParser.json.type,
    })
  )

  app.use(
    express.urlencoded({
      extended: config.service.middleware.bodyParser.urlencoded.extended,
      limit: config.service.middleware.bodyParser.urlencoded.limit,
      parameterLimit: config.service.middleware.bodyParser.urlencoded.parameterLimit,
    })
  )

  // Helmet
  if (config.service.middleware.helmet.enabled) {
    app.use(
      helmet({
        contentSecurityPolicy: config.service.middleware.helmet.contentSecurityPolicy,
        crossOriginEmbedderPolicy: config.service.middleware.helmet.crossOriginEmbedderPolicy,
        crossOriginOpenerPolicy: config.service.middleware.helmet.crossOriginOpenerPolicy,
        crossOriginResourcePolicy: config.service.middleware.helmet.crossOriginResourcePolicy,
        dnsPrefetchControl: config.service.middleware.helmet.dnsPrefetchControl,
        frameguard: config.service.middleware.helmet.frameguard,
        hidePoweredBy: config.service.middleware.helmet.hidePoweredBy,
        hsts: config.service.middleware.helmet.hsts,
        ieNoOpen: config.service.middleware.helmet.ieNoOpen,
        noSniff: config.service.middleware.helmet.noSniff,
        originAgentCluster: config.service.middleware.helmet.originAgentCluster,
        permittedCrossDomainPolicies: config.service.middleware.helmet.permittedCrossDomainPolicies,
        referrerPolicy: config.service.middleware.helmet.referrerPolicy,
        xssFilter: config.service.middleware.helmet.xssFilter,
      } as any)
    )
  }

  app.use(cookieParser() as any)

  // Auth middleware (if enabled)
  if (config.service.middleware.auth.enabled) {
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
