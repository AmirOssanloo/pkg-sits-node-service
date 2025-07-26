import type { Request, Response, NextFunction } from 'express'
import { EnrichedRequest } from '../typings/request.js'
import logger from '../utils/logger.js'

const loggerMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest.logger = enrichedRequest.logger || logger

  next()
}

export default loggerMiddleware
