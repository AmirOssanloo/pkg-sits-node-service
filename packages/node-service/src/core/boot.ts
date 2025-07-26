import type { Express } from 'express'
import type { ReleaseResources } from '../types/index.js'
import type { Logger } from '../utils/logger.js'
import { getServiceConfig } from './config.js'
import createServer from './server.js'
import createGracefulShutdown from './shutdown.js'

const errorTypes = ['unhandledRejection', 'uncaughtExeption']

interface BootApp {
  app: Express
  releaseResources: ReleaseResources
  logger: Logger
}

const bootApp = async ({ app, releaseResources, logger }: BootApp) => {
  const config = getServiceConfig()
  const { server } = await createServer({ app, port: config.service?.port ?? 3000, logger })

  const gracefulShutdown = createGracefulShutdown({
    server,
    releaseResources,
    logger,
  })

  const processHandlers = []

  errorTypes.forEach((eventType) => {
    const shutdown = gracefulShutdown(eventType)

    const handler = async (error: Error) => {
      try {
        await shutdown(error)
        process.exit(0)
      } catch (error) {
        logger.error('Failed to shutdown gracefully', { error })
        process.exit(1)
      }
    }

    process.on(eventType, handler)
    processHandlers.push({ eventType, handler })
  })

  // Use signals from configuration
  const signalTraps = config.service?.shutdown?.signals ?? ['SIGTERM', 'SIGINT']

  signalTraps.forEach((eventType) => {
    const shutdown = gracefulShutdown(eventType)

    const handler = async (error: Error) => {
      try {
        await shutdown(error)
        process.exit(0)
      } catch (error) {
        logger.error('Killing process', { error })
        process.kill(process.pid, eventType)
      }
    }

    process.once(eventType, handler)
    processHandlers.push({ eventType, handler })
  })
}

export default bootApp
