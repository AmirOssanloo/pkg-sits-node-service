import type { ServerOptions as HttpsOptions } from 'node:https'

export interface StrategyDefinition {
  provider: string
  config?: Record<string, unknown> // any config that the provider needs, we need to define this once we know the providers
}

export interface StrategyPath {
  path: string
  strategy: string
}

export interface AuthConfig {
  strategies: Record<string, StrategyDefinition>
  paths: StrategyPath[]
}

export interface CloudConfig {
  cluster: string // defaults to '' for now (example: eu-staging)
  environment: string // defaults to '' for now (example: staging)
  region: string // defaults to '' for now (example: eu)
}

export interface CorsConfig {
  // When set to true, cors will be enabled allowing cross-origin requests
  // The default is false
  enabled: boolean
  // The recommendation is to override this with a specific list of origins
  // The default is null
  origins: string[] | null
  // The methods which allow for cross-origin requests
  // The default is null
  methods: string[] | null
  // The request headers that are supported for cross-origin requests
  // The default is null
  requestHeaders: string[] | null
  // The response headers which are supported for cross-origin requests.
  // The default is null
  responseHeaders: string[] | null
  // If enabled, the `Access-Control-Allow-Credentials` header will be set to `true`
  // The default is null
  supportsCredentials: boolean | null
  // If set to a non-nullish value, the `Access-Control-Max-Age` response-header will be included
  // The default is null
  maxAge: number | null
  // When enabled, preflight requests will end with a `204` response
  // The default is null
  endPreflightRequests: boolean | null
}

export interface HttpsConfig {
  enabled: boolean
  options: HttpsOptions
}

export interface CoreConfig {
  auth: AuthConfig | null // defaults to null
  cloud: CloudConfig
  port: number // defaults to 3000
  cors: CorsConfig
  https: HttpsConfig
}

export interface Config {
  name: string
  core: CoreConfig
  [key: string]: any
}

// Helper types for configuration overrides
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

export type ConfigOverrides = DeepPartial<Config>

// Type for user-provided configuration (all fields optional except name)
export interface UserConfig extends ConfigOverrides {
  name: string
}
