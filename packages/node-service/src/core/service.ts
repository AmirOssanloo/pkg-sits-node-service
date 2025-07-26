import express from 'express'
import type { Express, Router } from 'express'
import type { ReleaseResources, Logger } from '../types/index.js'
import logger from '../utils/logger.js'
import createApp from './app.js'
import bootApp from './boot.js'

interface ServiceListenOptions {
  releaseResources?: ReleaseResources
}

interface ServiceSetupOptions {
  handlers?: Router
}

const state = {
  hasBootstrapped: false,
  isRunning: false,
}

interface CreateNodeService {
  app: Express
  setup: (opts?: ServiceSetupOptions) => Promise<{
    run: (opts?: ServiceListenOptions) => void
  }>
  logger: Logger
}

const createNodeService = (): CreateNodeService => {
  const expressApp = express()

  const setup = async (opts: ServiceSetupOptions = {}) => {
    if (state.hasBootstrapped) {
      throw new Error('The app has already been bootstrapped')
    }

    const { handlers = express.Router() } = opts
    state.hasBootstrapped = true

    const app = createApp(expressApp, {
      handlers,
      logger,
    })

    const listen = async ({
      releaseResources: releaseResourcesByRun,
    }: ServiceListenOptions = {}) => {
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

export default createNodeService
