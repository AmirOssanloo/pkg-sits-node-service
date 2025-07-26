import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { path } from 'ramda'
import config from '@sits/configuration'
import type { EnrichedRequest } from '../../typings/request.js'
import isSecurePath from './isSecurePath.js'

const authMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  if (!isSecurePath(req)) {
    return next()
  }

  const enrichedRequest = req as EnrichedRequest
  const authToken = path<string>(['headers', 'authorization'], enrichedRequest)

  try {
    if (!authToken || !authToken.startsWith('Bearer')) {
      throw new Error('Unauthorized request')
    }

    const token = authToken.substring(7)
    const tokenPayload = await jwt.verify(token, config.env.JWT_SECRET)

    if (!tokenPayload || typeof tokenPayload === 'string') {
      throw new Error('Unauthorized request')
    }

    const { personaId, market } = tokenPayload

    enrichedRequest.context.user = {
      personaId,
      market,
    }

    return next()
  } catch {
    res.status(401).send('Unauthorized request')
  }
}

export default authMiddleware
