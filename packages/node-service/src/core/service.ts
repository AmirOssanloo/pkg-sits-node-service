import express from 'express'
import type { Express } from 'express'
import type { ReleaseResources, Logger } from '../types/index.js'
import logger from '../utils/logger.js'
import createApp from './app.js'
import bootApp from './boot.js'

// Re-export from types for backward compatibility
export type { ServiceListenOptions, ServiceSetupOptions } from '../types/index.js'

// Internal types
interface InternalServiceListenOptions {
  releaseResources?: ReleaseResources
}

interface InternalServiceSetupOptions {
  handlers?: Express
}

const state = {
  hasBootstrapped: false,
  isRunning: false,
}

interface NodeServiceReturn {
  app: Express
  setup: (opts?: InternalServiceSetupOptions) => Promise<{
    run: (opts?: InternalServiceListenOptions) => void
  }>
  logger: Logger
}

const NodeService = (): NodeServiceReturn => {
  const expressApp = express()

  const setup = async (opts: InternalServiceSetupOptions = {}) => {
    if (state.hasBootstrapped) {
      throw new Error('The app has already been bootstrapped')
    }

    state.hasBootstrapped = true

    const app = createApp(expressApp, {
      logger,
    })

    // Apply additional handlers if provided
    if (opts.handlers) {
      app.use(opts.handlers)
    }

    const listen = async ({
      releaseResources: releaseResourcesByRun,
    }: InternalServiceListenOptions = {}) => {
      if (state.isRunning) {
        throw new Error('The app has already been started')
      }

      state.isRunning = true

      const releaseResources = async () => {
        await Promise.all([releaseResourcesByRun ? releaseResourcesByRun() : null])
      }

      await bootApp({
        app,
        releaseResources,
        logger,
      })
    }

    const run = (opts = {}) => {
      listen(opts).catch((error) => {
        logger.error('The app crashed', error)
        throw error
      })
    }

    return {
      run,
    }
  }

  return {
    app: expressApp,
    setup,
    logger,
  }
}

export default NodeService
