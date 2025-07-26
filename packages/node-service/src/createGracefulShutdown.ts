import type { Server } from 'http'
import type { ReleaseResources } from './types.js'
import type { Logger } from './utils/logger.js'

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
        case 'unhandledExeption':
          logger.error('Caught unhandled exeption', { error })
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

      const serverShutdown = (resolve: () => void) => {
        server.close(async (error) => {
          if (error) {
            logger.error('Cannot shutdown server', { error })
          }

          try {
            await releaseResources()
          } catch (error) {
            logger.error('Error occured while releasing resources', { error })
          }

          resolve()
        })
      }

      await Promise.all([new Promise<void>(serverShutdown)])
    }
  }
}

export default createGracefulShutdownHandler
