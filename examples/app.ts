import { SNS } from '../src/index'
import crateHandlers from './handlers'

const createApp = async () => {
  const { setup, logger } = await SNS()
  const handlers = crateHandlers()

  const resources = {}
  const releaseResources = () => {}

  const sns = await setup({
    handlers,
  })

  return {
    ...sns,
    resources,
    releaseResources,
  }
}

export default createApp
