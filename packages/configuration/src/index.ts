import applyEnv from './applyEnv.js'
import assembleConfig from './assembleConfig.js'

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
export { mergeWithDefaults, validateConfig } from './mergeConfig.js'
export { getDefaultConfig } from './defaults.js'
