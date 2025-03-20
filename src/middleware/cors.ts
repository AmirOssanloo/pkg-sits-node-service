import type { CorsOptions } from 'cors'
import cors from 'cors'
import { NextFunction, Request, Response } from 'express'

const whitelist = ['http://localhost:8080', 'http://0.0.0.0:8080']

const corsMiddleware = () => {
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Origin is not allowed by CORS'))
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      // Set headers for preflight requests
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.header('Access-Control-Allow-Credentials', 'true')
      return res.sendStatus(200)
    }
    cors(corsOptions)(req, res, next)
  }
}

export default corsMiddleware
