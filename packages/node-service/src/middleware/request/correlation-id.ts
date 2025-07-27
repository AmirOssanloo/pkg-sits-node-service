import type { Request, Response, NextFunction } from 'express'
import { pathOr } from 'ramda'
import { v4 as uuidv4 } from 'uuid'

export const CORRELATION_ID = 'correlation_id'
export const CORRELATION_ID_HEADER = 'x-correlation-id'

/**
 * Creates and configures the correlation ID middleware
 */
const correlationIdMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  const correlationId = pathOr<string>(uuidv4(), [CORRELATION_ID], req)
  req[CORRELATION_ID] = correlationId

  res.setHeader(CORRELATION_ID_HEADER, correlationId)

  next()
}

export default correlationIdMiddleware
