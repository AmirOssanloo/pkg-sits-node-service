import type { Request } from 'express'

interface RequestContext {
  [key: string]: any
}

declare interface EnrichedRequest extends Request {
  correlation_id: string
  context: RequestContext
}
