import cors from 'cors'
import config from '../config'

const whitelist = ['http://localhost:8080', 'http://0.0.0.0:8080']

if (config.sns?.cors?.whitelist) {
  whitelist.push(...(config?.sns?.cors?.whitelist || []))
}

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
