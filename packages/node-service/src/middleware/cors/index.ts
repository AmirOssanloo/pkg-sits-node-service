import cors from 'cors'
import type { RequestHandler } from 'express'
import type { NodeServiceConfig } from '../../core/config.js'

/**
 * Creates and configures CORS middleware
 */
export default function createCorsMiddleware(config: NodeServiceConfig): RequestHandler | null {
  const corsConfig = config.core?.cors

  // If CORS is disabled, return null
  if (!corsConfig?.enabled) {
    return null
  }

  // Map from @sits/configuration format to cors middleware format
  const corsOptions: cors.CorsOptions = {
    credentials: corsConfig.supportsCredentials ?? false,
  }

  // Handle origins
  if (corsConfig.origins !== null) {
    corsOptions.origin = corsConfig.origins
  }

  // Handle methods
  if (corsConfig.methods !== null) {
    corsOptions.methods = corsConfig.methods
  }

  // Handle allowed headers (requestHeaders in config)
  if (corsConfig.requestHeaders !== null) {
    corsOptions.allowedHeaders = corsConfig.requestHeaders
  }

  // Handle exposed headers (responseHeaders in config)
  if (corsConfig.responseHeaders !== null) {
    corsOptions.exposedHeaders = corsConfig.responseHeaders
  }

  // Handle max age
  if (corsConfig.maxAge !== null) {
    corsOptions.maxAge = corsConfig.maxAge
  }

  // Handle preflight
  if (corsConfig.endPreflightRequests !== null) {
    corsOptions.preflightContinue = !corsConfig.endPreflightRequests
    corsOptions.optionsSuccessStatus = 204
  }

  return cors(corsOptions)
}
