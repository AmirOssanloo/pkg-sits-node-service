import type { Express } from 'express'
import config from './config'
import createGracefulShutdown from './createGracefulShutdown'
import createServer from './createServer'
import type { ReleaseResources } from './types'
import type { Logger } from './utils/logger'

const errorTypes = ['unhandledRejection', 'uncaughtExeption']
const signalTraps = ['exit', 'SIGTERM', 'SIGINT', 'SIGUSR2']

interface BootApp {
  app: Express
  releaseResources: ReleaseResources
  logger: Logger
}

const bootApp = async ({ app, releaseResources, logger }: BootApp) => {
  const { server } = await createServer({ app, port: config.sns.port, logger })

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
