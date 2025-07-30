import type { Request, Response, NextFunction } from 'express'
import logger from '../../utils/logger.js'

/**
 * Creates and configures the logger middleware
 */
const loggerMiddleware = () => (req: Request, res: Response, next: NextFunction) => {
  req.logger = req.logger || logger
  next()
}

export default loggerMiddleware
