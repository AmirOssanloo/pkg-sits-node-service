import http from 'http'
import type { AddressInfo } from 'net'
import type { Logger } from './utils/logger'

type Server = http.Server

interface CreateServer {
  app: any
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

  const server: Server = http.createServer(app)
  const scheme = 'http'

  const startServer = () => {
    return new Promise<void>((resolve, reject) => {
      server.once('error', reject)

      server.listen(port, () => {
        server.removeListener('error', reject)
        resolve()
      })
    })
  }

  server.on('error', (error: ServerError) => {
    switch (error.code) {
      case 'EACCESS':
        logger.error(`Port ${port} requires elevated privileges`)
        break
      case 'EADDRINUSE':
        logger.error(`Port ${port} is already in use`)
        break
      default:
        logger.error('Server error', { error })
    }
  })

  try {
    await startServer()

    const address = server.address() as AddressInfo
    const host = address && address.address === '::' ? 'localhost' : address.address

    logger.info(`Server is running at ${scheme}://${host}:${port}`)
    logger.info(`Process is using PID ${process.pid}`)
  } catch (error) {
    logger.error('Error starting server', { error })
  }

  return { server, port }
}

export default createServer
