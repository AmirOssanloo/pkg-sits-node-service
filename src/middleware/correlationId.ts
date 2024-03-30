import type { Request, Response, NextFunction } from 'express'
import { pathOr } from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import { EnrichedRequest } from '../typings/request'

const CORRELATION_ID = 'correlation-id'

const correlationIdMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  const correlationId = pathOr<string>(uuidv4(), ['headers', CORRELATION_ID], req)
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest.correlation_id = correlationId

  res.setHeader(CORRELATION_ID, correlationId)

  next()
}

export default correlationIdMiddleware
