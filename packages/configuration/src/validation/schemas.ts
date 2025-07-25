import { z } from 'zod'

// Strategy definitions for authentication
export const StrategyDefinitionSchema = z.object({
  provider: z.string().min(1, { message: 'Provider name is required' }),
  config: z.record(z.string(), z.unknown()).optional()
})

export const StrategyPathSchema = z.object({
  path: z.string().min(1, { message: 'Path is required' }),
  strategy: z.string().min(1, { message: 'Strategy name is required' })
})

export const AuthConfigSchema = z.object({
  strategies: z.record(z.string(), StrategyDefinitionSchema),
  paths: z.array(StrategyPathSchema)
})

// Cloud configuration
export const CloudConfigSchema = z.object({
  cluster: z.string().default(''),
  environment: z.string().default(''),
  region: z.string().default('')
})

// CORS configuration
export const CorsConfigSchema = z.object({
  enabled: z.boolean().default(false),
  origins: z.array(z.string().url()).nullable().default(null),
  methods: z.array(z.string()).nullable().default(null),
  requestHeaders: z.array(z.string()).nullable().default(null),
  responseHeaders: z.array(z.string()).nullable().default(null),
  supportsCredentials: z.boolean().nullable().default(null),
  maxAge: z.number().int().positive().nullable().default(null),
  endPreflightRequests: z.boolean().nullable().default(null)
})

// HTTPS configuration
export const HttpsConfigSchema = z.object({
  enabled: z.boolean().default(false),
  options: z.record(z.string(), z.unknown()).default({})
})

// Core configuration (framework settings)
export const CoreConfigSchema = z.object({
  auth: AuthConfigSchema.nullable().default(null),
  cloud: CloudConfigSchema.default({ cluster: '', environment: '', region: '' }),
  port: z.number()
    .int()
    .min(0, { message: 'Port must be 0 or greater' })
    .max(65535, { message: 'Port must be 65535 or less' })
    .default(3000),
  cors: CorsConfigSchema.default({
    enabled: false,
    origins: null,
    methods: null,
    requestHeaders: null,
    responseHeaders: null,
    supportsCredentials: null,
    maxAge: null,
    endPreflightRequests: null
  }),
  https: HttpsConfigSchema.default({ enabled: false, options: {} })
})

// Base configuration schema (strict)
export const BaseConfigSchema = z.object({
  name: z.string().min(1, { message: 'Service name is required' }),
  core: CoreConfigSchema,
  env: z.record(z.string(), z.string()).optional()
})

// Main configuration schema with additional properties
// Uses intersection to allow both defined properties and additional ones
export const ConfigSchema = BaseConfigSchema.and(
  z.record(z.string(), z.unknown())
)

// Type exports from schemas
export type StrategyDefinition = z.infer<typeof StrategyDefinitionSchema>
export type StrategyPath = z.infer<typeof StrategyPathSchema>
export type AuthConfig = z.infer<typeof AuthConfigSchema>
export type CloudConfig = z.infer<typeof CloudConfigSchema>
export type CorsConfig = z.infer<typeof CorsConfigSchema>
export type HttpsConfig = z.infer<typeof HttpsConfigSchema>
export type CoreConfig = z.infer<typeof CoreConfigSchema>
export type Config = z.infer<typeof ConfigSchema>

// User config type (all optional except name)
export type UserConfig = z.input<typeof ConfigSchema>

// Validation options
export interface ValidationOptions {
  /**
   * If true, unknown properties will cause validation to fail
   * @default false
   */
  strict?: boolean
  
  /**
   * If true, all validation errors will be collected before throwing
   * @default true
   */
  abortEarly?: boolean
}

// Default validation options
export const defaultValidationOptions: ValidationOptions = {
  strict: false,
  abortEarly: false
}