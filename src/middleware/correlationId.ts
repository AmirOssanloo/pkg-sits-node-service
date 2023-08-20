import type { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { EnrichedRequest } from '../typings/request'

const CORRELATION_ID = 'correlation-id'

const correlationIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const correlationId = String(req.headers[CORRELATION_ID] || uuidv4())
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest.correlation_id = correlationId

  res.setHeader(CORRELATION_ID, correlationId)

  next()
}

export default correlationIdMiddleware
