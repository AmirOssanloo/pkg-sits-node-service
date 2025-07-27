import type { BaseConfig } from '../types.js'

export const defaultConfig: BaseConfig = {
  name: 'new-service',
  environment: null,
  core: {
    auth: null,
    cloud: {
      cluster: '',
      stage: '',
      region: '',
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    https: {
      enabled: false,
      options: {},
    },
  },
}

export function getDefaultConfig(): BaseConfig {
  return { ...defaultConfig }
}
