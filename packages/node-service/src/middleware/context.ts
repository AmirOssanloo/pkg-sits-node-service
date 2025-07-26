import type { Request, Response, NextFunction } from 'express'
import { EnrichedRequest } from '../typings/request.js'

const contextMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest.context = enrichedRequest.context || {}

  next()
}

export default contextMiddleware
