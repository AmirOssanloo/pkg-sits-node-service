import { z } from 'zod'
import {
  StrategyDefinitionSchema,
  StrategyPathSchema,
  AuthConfigSchema,
  CloudConfigSchema,
  HttpsConfigSchema,
  CoreConfigSchema,
  ConfigSchema,
  BaseConfigSchema,
  MiddlewareConfigSchema,
} from './validation/schemas.js'

// Type exports from schemas
export type StrategyDefinition = z.infer<typeof StrategyDefinitionSchema>
export type StrategyPath = z.infer<typeof StrategyPathSchema>
export type AuthConfig = z.infer<typeof AuthConfigSchema>
export type CloudConfig = z.infer<typeof CloudConfigSchema>
export type HttpsConfig = z.infer<typeof HttpsConfigSchema>
export type CoreConfig = z.infer<typeof CoreConfigSchema>
export type MiddlewareConfig = z.infer<typeof MiddlewareConfigSchema>

export type BaseConfig = z.infer<typeof BaseConfigSchema>
export type UserConfig = z.infer<typeof ConfigSchema>
