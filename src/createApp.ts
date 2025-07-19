import cookieParser from 'cookie-parser'
import type { FastifyInstance, FastifyReply, FastifyRequest, FastifyPluginAsync } from 'fastify'
import helmet from '@fastify/helmet'
import { authMiddleware } from './middleware/auth'
import contextMiddleware from './middleware/context'
import correlationIdMiddleware from './middleware/correlationId'
import corsMiddleware from './middleware/cors'
import loggerMiddleware from './middleware/logger'
import type { Logger } from './utils/logger'

interface ServiceOptions {
  handlers?: FastifyPluginAsync
  logger?: Logger
}

const createApp = async (app: FastifyInstance, { handlers = async () => {} }: ServiceOptions) => {
  // app.use(corsMiddleware())
  // app.use(express.json())
  // app.use(helmet())
  // app.use(cookieParser())
  // app.use(contextMiddleware())
  // app.use(authMiddleware())
  // app.use(correlationIdMiddleware())
  // app.use(loggerMiddleware())

  app.get('/ping', async (request, reply) => {
    reply.send({ timestamp: new Date().toISOString() })
  })

  // app.use(async (req, res, next) => {
  //   try {
  //     await handlers(req, res, next)
  //   } catch (error) {
  //     next(error)
  //   }
  // })

  return app
}

export default createApp
