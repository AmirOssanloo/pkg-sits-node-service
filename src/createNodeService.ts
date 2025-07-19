import Fastify from 'fastify'
import type { FastifyPluginAsync } from 'fastify'
import bootApp from './bootApp'
import createApp from './createApp'
import type { ReleaseResources } from './types'
import logger from './utils/logger'

interface ServiceListenOptions {
  releaseResources?: ReleaseResources
}

interface ServiceSetupOptions {
  handlers?: FastifyPluginAsync
}

const state = {
  hasBootstrapped: false,
  isRunning: false,
}

const NodeService = async () => {
  const fastifyApp = Fastify()

  const setup = async (opts: ServiceSetupOptions = {}) => {
    if (state.hasBootstrapped) {
      throw new Error('The app has already been bootstrapped')
    }

    const { handlers } = opts
    state.hasBootstrapped = true

    const app = await createApp(fastifyApp, {
      handlers,
      logger,
    })

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
    app: fastifyApp,
    setup,
    logger,
  }
}

export default NodeService
