import express from 'express'
import type { Express } from 'express'
import bootApp from './bootApp.js'
import createApp from './createApp.js'
import type { ReleaseResources } from './types.js'
import logger from './utils/logger.js'
import type { Logger } from './utils/logger.js'

export interface ServiceListenOptions {
  releaseResources?: ReleaseResources
}

export interface ServiceSetupOptions {
  handlers?: Express
}

const state = {
  hasBootstrapped: false,
  isRunning: false,
}

interface NodeServiceReturn {
  app: Express
  setup: (opts?: ServiceSetupOptions) => Promise<{
    run: (opts?: ServiceListenOptions) => void
  }>
  logger: Logger
}

const NodeService = (): NodeServiceReturn => {
  const expressApp = express()

  const setup = async (opts: ServiceSetupOptions = {}) => {
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

    const listen = async ({ releaseResources: releaseResourcesByRun }: ServiceListenOptions) => {
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
