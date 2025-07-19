import type { FastifyInstance } from 'fastify'
import http from 'http'
import type { AddressInfo } from 'net'
import type { Logger } from './utils/logger'

interface CreateServer {
  app: FastifyInstance
  port: number
  logger: Logger
}

interface ServerError extends Error {
  code?: string
}

const createServer = async ({ app, port, logger }: CreateServer) => {
  if (!port) {
    throw new Error('Cannot create the server since no port was provided.')
  }

  const server = app.server
  const scheme = 'http'

  server.on('connection', (socket) => {
    socket.on('error', (error) => {
      logger.error('Socket error', { error })
    })
  })

  server.on('request', (req, res) => {
    // Custom request handling hooks
    // res.setHeader('X-Custom-Server', 'Fastify-Custom')
  })

  server.on('error', (error: ServerError) => {
    switch (error.code) {
      case 'EACCES':
        logger.error(`Port ${port} requires elevated privileges`)
        break
      case 'EADDRINUSE':
        logger.error(`Port ${port} is already in use`)
        break
      default:
        logger.error('Server error', { error })
    }
  })

  const startServer = async () => {
    await app.listen({ port })

    const address = server.address() as AddressInfo
    let host: string

    if (address) {
      switch (address.address) {
        case '::':
        case '::1':
          host = 'localhost'
          break
        case '0.0.0.0':
        case '127.0.0.1':
          host = 'localhost'
          break
        default:
          host = address.address.includes(':') ? `[${address.address}]` : address.address
      }
    } else {
      host = 'localhost'
    }

    return host
  }

  try {
    const host = await startServer()

    logger.info(`Server is running at ${scheme}://${host}:${port}`)
    logger.info(`Process is using PID ${process.pid}`)
  } catch (error) {
    logger.error('Error starting server', { error })
  }

  return { server, port }
}

export default createServer
