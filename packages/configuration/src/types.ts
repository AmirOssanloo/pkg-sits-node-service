import type { ServerOptions as HttpsOptions } from 'node:https'

/**
 * Authentication strategy definition
 */
export interface StrategyDefinition {
  /** Strategy provider identifier (e.g., 'jwt', 'oauth2', 'basic') */
  provider: string
  /** Provider-specific configuration options */
  config?: Record<string, unknown>
}

/**
 * Path-to-strategy mapping for route protection
 */
export interface StrategyPath {
  /** URL path or pattern to protect */
  path: string
  /** Name of the strategy to apply */
  strategy: string
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  /** Available authentication strategies keyed by name */
  strategies: Record<string, StrategyDefinition>
  /** Routes and their required authentication strategies */
  paths: StrategyPath[]
}

/**
 * Cloud deployment configuration
 */
export interface CloudConfig {
  /** Cluster identifier (e.g., 'eu-staging', 'us-prod') */
  cluster: string
  /** Deployment environment (e.g., 'development', 'staging', 'production') */
  environment: string
  /** Cloud region (e.g., 'eu-west-1', 'us-east-1') */
  region: string
}

/**
 * Cross-Origin Resource Sharing (CORS) configuration
 */
export interface CorsConfig {
  /** Enable CORS support @default false */
  enabled: boolean

  /** Allowed origins for cross-origin requests @default null */
  origins: string[] | null

  /** Allowed HTTP methods @default null */
  methods: string[] | null

  /** Allowed request headers @default null */
  requestHeaders: string[] | null

  /** Exposed response headers @default null */
  responseHeaders: string[] | null

  /** Allow credentials in CORS requests @default null */
  supportsCredentials: boolean | null

  /** Max age for preflight cache (seconds) @default null */
  maxAge: number | null

  /** End preflight requests with 204 status @default null */
  endPreflightRequests: boolean | null
}

/**
 * HTTPS server configuration
 */
export interface HttpsConfig {
  /** Enable HTTPS @default false */
  enabled: boolean
  /** Node.js HTTPS server options (cert, key, etc.) */
  options: HttpsOptions
}

/**
 * Core framework configuration
 */
export interface CoreConfig {
  /** Authentication configuration @default null */
  auth: AuthConfig | null
  /** Cloud deployment settings */
  cloud: CloudConfig
  /** Server port @default 3000 */
  port: number
  /** CORS configuration */
  cors: CorsConfig
  /** HTTPS configuration */
  https: HttpsConfig
}

/**
 * Complete service configuration
 */
export interface Config {
  /** Service name (required) */
  name: string
  /** Core framework settings */
  core: CoreConfig
  /** Additional custom properties */
  [key: string]: any
}

/**
 * Utility type for partial nested objects
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Type for configuration overrides (all fields optional)
 */
export type ConfigOverrides = DeepPartial<Config>

/**
 * User-provided configuration type
 * All fields are optional except name
 */
export interface UserConfig extends ConfigOverrides {
  name: string
}
