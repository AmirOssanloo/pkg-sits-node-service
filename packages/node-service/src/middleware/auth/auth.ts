import config from '@sits/configuration'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import isSecurePath from './isSecurePath.js'
import type { JwtAuthIdentity } from '../../types/auth.js'

const authMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  // TODO: Add support for multiple auth strategies
  // TODO: Ensure that the path is matching the strategy path
  if (!isSecurePath(req)) {
    return next()
  }

  const authToken = req.headers.authorization

  try {
    if (!authToken || !authToken.startsWith('Bearer ')) {
      throw new Error('Unauthorized request')
    }

    // Get JWT configuration from core.auth
    const authConfig = config.core?.auth

    // TODO: Add support for multiple auth strategies
    const jwtStrategy = authConfig?.strategies?.jwt
    const secret = jwtStrategy?.config?.secret as string

    if (!secret) {
      throw new Error(
        'JWT secret not configured. Please set core.auth.strategies.jwt.config.secret in your configuration.'
      )
    }

    const token = authToken.substring(7)
    const tokenPayload = jwt.verify(token, secret)

    if (!tokenPayload || typeof tokenPayload === 'string') {
      throw new Error('Unauthorized request')
    }

    // Store the user information from the token
    req.auth = tokenPayload as JwtAuthIdentity

    return next()
  } catch {
    res.status(401).json({ error: 'Unauthorized request' })
  }
}

export default authMiddleware
