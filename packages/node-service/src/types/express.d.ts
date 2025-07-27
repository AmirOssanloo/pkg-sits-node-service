import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { Logger } from '../utils/logger.js'

/**
 * User information extracted from JWT token
 */
export interface AuthenticatedUser extends JwtPayload {
  id?: string | number
  email?: string
  username?: string
  roles?: string[]
  permissions?: string[]
}

/**
 * Module augmentation for Express Request
 */
declare module 'express' {
  interface Request {
    correlation_id: string
    context: RequestContext
    logger: Logger
    validated: {
      body?: any
      query?: any
      params?: any
    }
    user?: AuthenticatedUser
  }
}

/**
 * Request context for storing request-scoped data
 */
export interface RequestContext {
  [key: string]: any
}

/**
 * Enhanced request interface with generic support for validated data
 */
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
  user?: AuthenticatedUser
}
