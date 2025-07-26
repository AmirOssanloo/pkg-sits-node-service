import { Response, NextFunction } from 'express'
import { BasicError } from '../../errors/BasicError.js'
import { EnrichedRequest } from '../../types/express.js'

const errorHandlerMiddleware = (
  error: Error,
  req: EnrichedRequest,
  res: Response,
  next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // If headers have already been sent, delegate to Express's default error handler
  if (res.headersSent) {
    return next(error)
  }

  req.logger.error(error.message, {
    error,
    payload: {
      correlation_id: req.correlation_id,
      path: req.path,
      method: req.method,
      stack: isDevelopment ? error.stack : undefined,
    },
  })

  // If the error is one of our custom errors (BasicError or its children)
  if (error instanceof BasicError) {
    return res.status(error.status).json({
      error: {
        name: error.name,
        message: error.message,
        errors: error.errors,
        stack: isDevelopment ? error.stack : undefined,
      },
    })
  }

  // Handle unexpected errors
  return res.status(500).json({
    error: {
      name: 'INTERNAL_SERVER_ERROR',
      message: isDevelopment ? error.message : 'An unexpected error occurred',
      stack: isDevelopment ? error.stack : undefined,
    },
  })
}

export default errorHandlerMiddleware
