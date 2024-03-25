import type { Request, Response, NextFunction } from 'express'
import { EnrichedRequest } from '../typings/request'
import logger from '../utils/logger'

const loggerMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest.logger = enrichedRequest.logger || logger

  next()
}

export default loggerMiddleware
