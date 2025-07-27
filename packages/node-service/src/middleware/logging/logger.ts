import type { Request, Response, NextFunction } from 'express'
import { EnrichedRequest } from '../../types/express.js'
import logger from '../../utils/logger.js'

/**
 * Creates and configures the logger middleware
 */
const loggerMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest.logger = enrichedRequest.logger || logger

  next()
}

export default loggerMiddleware
