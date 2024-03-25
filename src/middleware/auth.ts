import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { path, pathOr } from 'ramda'
import config from '../config'
import type { EnrichedRequest } from '../typings/request'

const isSecurePath = (req: Request) => {
  const originalUrl = path(['originalUrl'], req)
  const securePaths = pathOr([], ['sns', 'auth', 'jwt', 'securePaths'], config)

  return securePaths.some((path) => originalUrl.startsWith(path))
}

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
  } catch (err) {
    res.status(401).send('Unauthorized request')
  }
}

export default authMiddleware
