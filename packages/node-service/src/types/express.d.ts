import type { Logger } from '../utils/logger.js'
import type { RequestContext } from './request.js'
import type { AuthIdentity } from './auth.js'

declare global {
  namespace Express {
    interface Request {
      correlation_id: string
      context: RequestContext
      logger: Logger
      validated: {
        body?: any
        query?: any
        params?: any
      }
      auth?: AuthIdentity
    }
  }
}
