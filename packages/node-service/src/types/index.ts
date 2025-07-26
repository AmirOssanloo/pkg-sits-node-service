import type { Server } from 'node:http'
import type { Express, Request, Response, NextFunction } from 'express'
import type { ZodSchema, ZodObject } from 'zod'
import type { Logger } from '../utils/logger.js'

/**
 * Core service types
 */

// Service configuration options
export interface ServiceSetupOptions {
  name: string
  version: string
  environment?: string
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
  trustProxy?: boolean
  corsOptions?: CorsOptions
  helmetOptions?: any
  authOptions?: AuthOptions
}

// Service listen options
export interface ServiceListenOptions {
  port: number
  host?: string
  backlog?: number
}

// Service instance
export interface NodeServiceInstance {
  app: Express
  server: Server
  config: ServiceSetupOptions
  listen: (options: ServiceListenOptions) => Promise<Server>
  shutdown: () => Promise<void>
}

/**
 * Middleware types
 */

// CORS options
export interface CorsOptions {
  origin?:
    | string
    | string[]
    | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void)
  credentials?: boolean
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  maxAge?: number
  preflightContinue?: boolean
  optionsSuccessStatus?: number
}

// Auth middleware options
export interface AuthOptions {
  secret: string
  algorithms?: string[]
  credentialsRequired?: boolean
  requestProperty?: string
  isRevoked?: (req: Request, token: any) => Promise<boolean> | boolean
  onExpired?: (req: Request, res: Response) => void
}

// Validation schemas (Zod only)
export interface ValidationSchema {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
}

// Validation options
export interface ValidationOptions {
  coerce?: boolean // Enable type coercion
}

/**
 * Request types
 */

// Request context for storing request-scoped data
export interface RequestContext {
  [key: string]: any
}

// Enhanced request with added properties
export interface EnrichedRequest<T = any> extends Request {
  correlation_id: string
  context: RequestContext
  logger: Logger
  validated: T extends { body?: any; query?: any; params?: any }
    ? T
    : {
        body?: any
        query?: any
        params?: any
      }
  user?: any // Added by auth middleware
}

// Type helpers for Zod schemas
export type InferZodSchema<T> = T extends ZodObject<infer U> ? U : never
export type InferValidatedRequest<T extends ValidationSchema> = {
  body: T['body'] extends ZodObject<any> ? InferZodSchema<T['body']> : any
  query: T['query'] extends ZodObject<any> ? InferZodSchema<T['query']> : any
  params: T['params'] extends ZodObject<any> ? InferZodSchema<T['params']> : any
}

/**
 * Middleware types
 */

export type Middleware = (
  req: EnrichedRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>
export type ErrorMiddleware = (
  err: Error,
  req: EnrichedRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>

/**
 * Handler types
 */

export type RouteHandler<T = any> = (
  req: EnrichedRequest<T>,
  res: Response,
  next: NextFunction
) => void | Promise<void>
export type ErrorHandler = (
  err: Error,
  req: EnrichedRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>

/**
 * Utility types
 */

// Function that releases resources (used in graceful shutdown)
export type ReleaseResources = () => Promise<void> | void

// Server lifecycle hooks
export interface ServerLifecycleHooks {
  onStart?: () => void | Promise<void>
  onShutdown?: () => void | Promise<void>
  onError?: (error: Error) => void
}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  service: string
  version: string
  uptime: number
  details?: Record<string, any>
}

/**
 * Error types
 */

export interface HttpError extends Error {
  status: number
  errors?: Record<string, any>
}

/**
 * Re-export commonly used types
 */
export type { Logger } from '../utils/logger.js'
export type {
  BasicError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from '../errors/index.js'
