import type { Request, Response, NextFunction } from 'express'

/**
 * Creates and configures the context middleware
 */
const contextMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  req.context = req.context || {}
  next()
}

export default contextMiddleware
