import http from 'http'
import type { AddressInfo } from 'net'
import type { Express } from 'express'
import type { Logger } from './utils/logger.js'

interface CreateServer {
  app: Express
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

  const server = http.createServer(app)
  const scheme = 'http'

  server.on('connection', (socket) => {
    socket.on('error', (error) => {
      logger.error('Socket error', { error })
    })
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

  const startServer = () => {
    return new Promise<string>((resolve, reject) => {
      server.listen(port, () => {
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

        resolve(host)
      })

      server.on('error', reject)
    })
  }

  try {
    const host = await startServer()

    logger.info(`Server is running at ${scheme}://${host}:${port}`)
    logger.info(`Process is using PID ${process.pid}`)
  } catch (error) {
    logger.error('Error starting server', { error })
    throw error
  }

  return { server, port }
}

export default createServer
