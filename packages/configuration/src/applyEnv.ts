import { hasIn } from 'ramda'
import type { Config } from './types.js'

const CONFIG_ENV_KEY = 'env'

const applyEnv = (config: Config): Config => {
  if (hasIn(CONFIG_ENV_KEY, config)) {
    const env = config[CONFIG_ENV_KEY]

    if (env) {
      Object.keys(env).forEach((key) => {
        process.env[key] = env[key]
      })
    }

    if (process.env.NODE_ENV === 'production') {
      delete config[CONFIG_ENV_KEY]
    }
  }

  return config
}

export default applyEnv
