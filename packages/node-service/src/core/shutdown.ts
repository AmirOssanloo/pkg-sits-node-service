import type { Server } from 'http'
import type { ReleaseResources } from '../types/index.js'
import type { Logger } from '../utils/logger.js'

interface GracefulShutdown {
  server: Server
  releaseResources: ReleaseResources
  logger: Logger
}

export type GracefulShutdownHandler = (error?: string | Error) => Promise<void>

const createGracefulShutdownHandler = ({ server, releaseResources, logger }: GracefulShutdown) => {
  return (eventType: string): GracefulShutdownHandler => {
    return async (error?: string | Error) => {
      switch (eventType) {
        case 'unhandledRejection':
          logger.error('Caught unhandled promise rejections', { error })
          break
        case 'uncaughtException':
          logger.error('Uncaught exeption handled', { error })
          break
        case 'exit':
          logger.info('Exit was called', { meta: { error } })
          break
        case 'SIGINT':
        case 'SIGTERM':
        case 'SIGUSR2':
          logger.info(`${eventType} was called`)
          break
        default:
          logger.info('Shutting down')
      }

      logger.info(`Graceful shutdown started at ${new Date().toISOString()}`)

      // Shut down server
      await new Promise<void>((resolve) => {
        server.close((error) => {
          if (error) {
            logger.error('Cannot shutdown server', { error })
          }
          resolve()
        })
      })

      // Release resources after server is closed
      try {
        await releaseResources()
      } catch (error) {
        logger.error('Error occured while releasing resources', { error })
      }
    }
  }
}

export default createGracefulShutdownHandler
