import type { Config } from '../types.js'

export const defaultConfig: Config = {
  name: 'service',
  core: {
    auth: null, // No authentication by default
    cloud: {
      cluster: '', // Empty by default
      environment: '', // Empty by default
      region: '', // Empty by default
    },
    port: 3000, // Default port
    cors: {
      enabled: false, // CORS disabled by default
      origins: null,
      methods: null,
      requestHeaders: null,
      responseHeaders: null,
      supportsCredentials: null,
      maxAge: null,
      endPreflightRequests: null,
    },
    https: {
      enabled: false, // HTTPS disabled by default
      options: {}, // Empty options
    },
  },
}

export function getDefaultConfig(): Config {
  // Return a deep copy to prevent mutation of defaults
  return JSON.parse(JSON.stringify(defaultConfig))
}
