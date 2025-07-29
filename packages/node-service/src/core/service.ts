import express, { RequestHandler } from 'express'
import type { Application } from 'express'
import type { ReleaseResources } from '../types/index.js'
import type { Logger } from '../utils/logger.js'
import logger from '../utils/logger.js'
import createApp from './app.js'
import bootApp from './boot.js'

interface CreateNodeServiceReturn {
  setup: (options?: ServiceSetupOptions) => Promise<SetupNodeServiceReturn>
  logger: Logger
}

interface SetupNodeServiceReturn {
  run: (options?: ServiceRunOptions) => void
  app: Application
}

interface ServiceSetupOptions {
  handlers?: RequestHandler
  releaseResources?: ReleaseResources
}

interface ServiceRunOptions {
  releaseResources?: ReleaseResources
}

const state = {
  hasBootstrapped: false,
  isRunning: false,
}

const createNodeService = (): CreateNodeServiceReturn => {
  const expressApp = express()

  const setup = async (options: ServiceSetupOptions = {}) => {
    if (state.hasBootstrapped) {
      throw new Error('The app has already been bootstrapped')
    }

    state.hasBootstrapped = true
    const { handlers } = options

    const app = createApp(expressApp, {
      handlers,
      logger,
    })

    const run = async (options: ServiceRunOptions = {}) => {
      const { releaseResources: releaseResourcesByRun } = options

      if (state.isRunning) {
        throw new Error('The app has already been started')
      }

      state.isRunning = true

      const releaseResources = async () => {
        await Promise.all([releaseResourcesByRun ? releaseResourcesByRun() : null])
      }

      try {
        await bootApp({
          app,
          releaseResources,
          logger,
        })
      } catch (error) {
        logger.error('The app crashed', { error })
        throw error
      }
    }

    return {
      run,
      app,
    }
  }

  return {
    setup,
    logger,
  }
}

export default createNodeService
