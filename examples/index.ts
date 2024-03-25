#!/user/bin/env node
import createApp from './app'

createApp().then(({ run, releaseResources, logger }) => {
  logger.info('Starting the app')
  run({ releaseResources })
})
