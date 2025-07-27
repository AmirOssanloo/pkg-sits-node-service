import { hasIn } from 'ramda'
import type { UserConfig } from '../types.js'

const CONFIG_ENV_KEY = 'env'

const applyEnv = (config: UserConfig): UserConfig => {
  if (hasIn(CONFIG_ENV_KEY, config)) {
    const env = config[CONFIG_ENV_KEY] as Record<string, unknown>

    if (env) {
      Object.keys(env).forEach((key) => {
        process.env[key] = env[key] as string
      })
    }

    if (process.env.NODE_ENV === 'production') {
      delete config[CONFIG_ENV_KEY]
    }
  }

  return config
}

export default applyEnv
