import { z } from 'zod'

// Strategy definitions for authentication
export const StrategyDefinitionSchema = z.object({
  provider: z.string().min(1, { message: 'Provider name is required' }),
  config: z.record(z.string(), z.unknown()).optional(),
})

export const StrategyPathSchema = z.object({
  path: z.string().min(1, { message: 'Path is required' }),
  strategy: z.string().min(1, { message: 'Strategy name is required' }),
})

export const AuthConfigSchema = z.object({
  strategies: z.record(z.string(), StrategyDefinitionSchema),
  paths: z.array(StrategyPathSchema),
})

// Cloud configuration
export const CloudConfigSchema = z.object({
  stage: z.string().default(''), // staging, production, etc.
  region: z.string().default(''), // eu-west-1, us-east-1, etc.
  cluster: z.string().default(''), // eu-staging, eu-production, etc.
})

// Server configuration
export const ServerConfigSchema = z.object({
  host: z.string().default('0.0.0.0'),
  port: z.number().int().default(3000),
})

// HTTPS configuration
export const HttpsConfigSchema = z.object({
  enabled: z.boolean().default(false),
  options: z.record(z.string(), z.unknown()).default({}),
})

// Core configuration (framework settings)
export const CoreConfigSchema = z.object({
  auth: AuthConfigSchema.nullable().default(null),
  cloud: CloudConfigSchema.default({ cluster: '', stage: '', region: '' }),
  server: ServerConfigSchema.default({ host: '0.0.0.0', port: 3000 }),
  https: HttpsConfigSchema.default({ enabled: false, options: {} }),
})

// Base configuration schema (strict)
export const BaseConfigSchema = z.object({
  name: z.string().min(1, { message: 'Service name is required' }),
  environment: z.string().nullable().default(null),
  core: CoreConfigSchema,
})

// Main configuration schema with additional properties
// Uses intersection to allow both defined properties and additional ones
export const ConfigSchema = BaseConfigSchema.and(z.record(z.string(), z.unknown()))
