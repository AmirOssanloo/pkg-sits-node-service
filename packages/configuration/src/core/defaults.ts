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
  middleware: {
    cors: {
      enabled: false,
    },
    helmet: {
      enabled: false,
    },
    bodyParser: {
      enabled: false,
    },
    cookieParser: {
      enabled: false,
    },
    logger: {
      enabled: false,
    },
    correlationId: {
      enabled: false,
    },
    context: {
      enabled: false,
    },
    health: {
      enabled: false,
    },
  },
}

export function getDefaultConfig(): BaseConfig {
  return { ...defaultConfig }
}
