import applyEnv from './processors/env.js'
import assembleConfig from './core/assemble.js'

const config = assembleConfig('config')
const envConfig = applyEnv(config)

export default envConfig

// Export all types
export type {
  Config,
  CoreConfig,
  UserConfig,
  ConfigOverrides,
  DeepPartial,
  AuthConfig,
  CloudConfig,
  CorsConfig,
  HttpsConfig,
  StrategyDefinition,
  StrategyPath,
} from './types.js'

// Export utilities for programmatic use
export { mergeWithDefaults } from './core/merge.js'
export { getDefaultConfig } from './core/defaults.js'

// Export validation utilities
export {
  validateConfig,
  validateConfigAsync,
  safeValidateConfig,
  isValidConfig,
  extractConfigPath
} from './validation/validator.js'

export {
  ConfigValidationError,
  type ValidationIssue
} from './validation/errors.js'

export type { ValidationOptions } from './validation/schemas.js'

// Export schemas for extension
export {
  ConfigSchema,
  BaseConfigSchema,
  CoreConfigSchema,
  AuthConfigSchema,
  CloudConfigSchema,
  CorsConfigSchema,
  HttpsConfigSchema,
  StrategyDefinitionSchema,
  StrategyPathSchema
} from './validation/schemas.js'
