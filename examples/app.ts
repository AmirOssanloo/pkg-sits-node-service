import { SNS } from '../src/index'
import crateHandlers from './handlers'

const createApp = async () => {
  const { setup, logger } = await SNS()
  const handlers = crateHandlers()

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
