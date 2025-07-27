import express, { Router } from 'express'
import type { Application } from 'express'
import type { ReleaseResources, Logger } from '../types/index.js'
import logger from '../utils/logger.js'
import createApp from './app.js'
import bootApp from './boot.js'

interface CreateNodeServiceReturn {
  setup: (opts?: ServiceSetupOptions) => Promise<SetupNodeServiceReturn>
  logger: Logger
}

interface SetupNodeServiceReturn {
  run: (opts?: ServiceListenOptions) => void
  app: Application
}

interface ServiceSetupOptions {
  handlers?: Router
  releaseResources?: ReleaseResources
}

interface ServiceListenOptions {
  releaseResources?: ReleaseResources
}

const state = {
  hasBootstrapped: false,
  isRunning: false,
}

const createNodeService = (): CreateNodeServiceReturn => {
  const expressApp = express()

  const setup = async (opts: ServiceSetupOptions = {}) => {
    if (state.hasBootstrapped) {
      throw new Error('The app has already been bootstrapped')
    }

    state.hasBootstrapped = true

    const app = createApp(expressApp, {
      handlers: opts.handlers || Router(),
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
      app,
    }
  }

  return {
    setup,
    logger,
  }
}

export default createNodeService
