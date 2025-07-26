import config from '@sits/configuration'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { EnrichedRequest } from '../../types/express.js'
import isSecurePath from './isSecurePath.js'

// TODO: We need to remove the console.logs and figure out a better way to get observability into the application (IF IT IS NEEDED)

const authMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth middleware running')
  console.log('Request path:', req.path)
  console.log('isSecurePath:', isSecurePath(req))

  if (!isSecurePath(req)) {
    return next()
  }

  const enrichedRequest = req as EnrichedRequest
  const authToken = enrichedRequest.headers.authorization

  console.log('authToken:', authToken)

  try {
    if (!authToken || !authToken.startsWith('Bearer ')) {
      throw new Error('Unauthorized request')
    }

    // Get JWT configuration from core.auth
    // TODO: This needs to be improved and cleaned up. We need to find a better way to store the secret, process.env.JWT_SECRET is not a good idea and || 'my-super-secret-key-for-example' is not a good idea either.
    const authConfig = config.core?.auth
    const jwtStrategy = authConfig?.strategies?.jwt
    const secret =
      (jwtStrategy?.config?.secret as string) ||
      process.env.JWT_SECRET ||
      'my-super-secret-key-for-example'

    const token = authToken.substring(7)
    const tokenPayload = jwt.verify(token, secret)

    if (!tokenPayload || typeof tokenPayload === 'string') {
      throw new Error('Unauthorized request')
    }

    // Store the user information from the token
    // TODO: We should define what data we want to store in the user object.
    enrichedRequest.user = tokenPayload

    return next()
  } catch (error) {
    console.log('Auth error:', error)
    res.status(401).json({ error: 'Unauthorized request' })
  }
}

export default authMiddleware
