import cors from 'cors'
import type { CorsOptions } from 'cors'

const whitelist = ['http://localhost:8080', 'http://0.0.0.0:8080', 'http://51.21.205.125']

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

  return cors(corsOptions)
}

export default corsMiddleware
