import type { Request } from 'express'
import { Logger } from '../utils/logger'

interface RequestContext {
  [key: string]: any
}

declare interface EnrichedRequest extends Request {
  correlation_id: string
  context: RequestContext
  logger: Logger
}
