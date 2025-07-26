import type { Request, Response, NextFunction } from 'express'
import { pathOr } from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import { EnrichedRequest } from '../typings/request.js'

export const CORRELATION_ID = 'correlation_id'

const correlationIdMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  const correlationId = pathOr<string>(uuidv4(), [CORRELATION_ID], req)
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest[CORRELATION_ID] = correlationId

  res.setHeader(CORRELATION_ID, correlationId)

  next()
}

export default correlationIdMiddleware
