import { createNodeService } from '@sits/node-service'
import crateHandlers from './handlers'

const createApp = async () => {
  const { app, setup, logger } = createNodeService()
  const handlers = crateHandlers({ app })

  const sns = await setup({
    handlers,
  })

  const resources = {}
  const releaseResources = async () => {
    return await Promise.resolve()
  }

  return {
    ...sns,
    resources,
    releaseResources,
    logger,
  }
}

export default createApp
