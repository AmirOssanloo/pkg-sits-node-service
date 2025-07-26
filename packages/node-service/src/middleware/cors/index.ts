import cors from 'cors'
import type { RequestHandler } from 'express'
import type { NodeServiceConfig } from '../../core/config.js'

/**
 * Creates and configures CORS middleware
 */
export default function createCorsMiddleware(config: NodeServiceConfig): RequestHandler | null {
  const corsConfig = config.service.middleware?.cors

  // If CORS is disabled, return null
  if (corsConfig?.enabled === false) {
    return null
  }

  // Create CORS middleware with configuration
  return cors({
    origin: corsConfig?.origin ?? true,
    credentials: corsConfig?.credentials ?? true,
    methods: corsConfig?.methods ?? ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: corsConfig?.allowedHeaders,
    exposedHeaders: corsConfig?.exposedHeaders,
    maxAge: corsConfig?.maxAge,
    preflightContinue: corsConfig?.preflightContinue ?? false,
    optionsSuccessStatus: corsConfig?.optionsSuccessStatus ?? 204,
  })
}
