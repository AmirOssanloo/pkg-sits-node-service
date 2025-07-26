import type { Request, Response, NextFunction } from 'express'
import { EnrichedRequest } from '../../types/express.js'

const contextMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  const enrichedRequest = req as EnrichedRequest
  enrichedRequest.context = enrichedRequest.context || {}

  next()
}

export default contextMiddleware
