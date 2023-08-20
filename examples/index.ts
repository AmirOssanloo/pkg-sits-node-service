#!/user/bin/env node
import createApp from './app'

createApp().then(({ run, releaseResources }) => {
  run({ releaseResources })
})
