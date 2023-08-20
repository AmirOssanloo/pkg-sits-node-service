import { Request, Response, NextFunction } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { path, pathOr } from 'ramda'
import config from '../config'
import type { EnrichedRequest } from '../typings/request'

const isSecurePath = (req: Request) => {
  const originalUrl = path(['originalUrl'], req)
  const securePaths = pathOr([], ['sns', 'auth', 'jwt', 'securePaths'], config)

  return securePaths.some((path) => originalUrl.startsWith(path))
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!isSecurePath(req)) {
    return next()
  }

  const enrichedRequest = req as EnrichedRequest
  const authToken = path<string>(['headers', 'authorization'], enrichedRequest)
  let tokenPayload: JwtPayload | string

  if (!authToken || !authToken.startsWith('Bearer')) {
    return res.status(401).send('Unable to authenticate')
  }

  try {
    tokenPayload = await jwt.verify(authToken, config.env.JWT_SECRET)

    if (!tokenPayload || typeof tokenPayload === 'string') {
      return res.status(401).send('Unable to authenticate')
    }

    const { personaId, market } = tokenPayload

    enrichedRequest.context.user = {
      personaId,
      market,
    }

    return next()
  } catch (err) {
    res.status(401).send('Unable to authenticate')
  }

  next()
}

export default authMiddleware
