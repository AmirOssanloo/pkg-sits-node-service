import type { Request } from 'express'
import { Logger } from '../utils/logger'

export interface RequestContext {
  [key: string]: any
}

export interface EnrichedRequest extends Request {
  correlation_id: string
  context: RequestContext
  logger: Logger
}
