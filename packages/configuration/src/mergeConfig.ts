import { mergeDeepRight } from 'ramda'
import type { Config, UserConfig } from './types.js'
import { getDefaultConfig } from './defaults.js'

/**
 * Merges user configuration with defaults, ensuring all required fields are present
 * @param userConfig - The user-provided configuration
 * @returns Complete configuration with defaults applied
 */
export function mergeWithDefaults(userConfig: UserConfig): Config {
  const defaults = getDefaultConfig()
  
  // Override the default name if provided
  if (userConfig.name) {
    defaults.name = userConfig.name
  }
  
  // Deep merge the configurations, with user config taking precedence
  return mergeDeepRight(defaults, userConfig) as Config
}

/**
 * Validates that the configuration has all required fields
 * @param config - The configuration to validate
 * @throws Error if required fields are missing
 */
export function validateConfig(config: Config): void {
  if (!config.name || typeof config.name !== 'string') {
    throw new Error('Configuration must have a valid "name" field')
  }
  
  if (!config.core) {
    throw new Error('Configuration must have a "core" field')
  }
  
  // Validate core fields exist (they can have default values)
  const requiredCoreFields = ['cloud', 'port', 'cors', 'https'] as const
  
  for (const field of requiredCoreFields) {
    if (!(field in config.core)) {
      throw new Error(`Configuration core must have a "${field}" field`)
    }
  }
  
  // Validate types
  if (typeof config.core.port !== 'number') {
    throw new Error('Configuration core.port must be a number')
  }
  
  if (config.core.port < 0 || config.core.port > 65535) {
    throw new Error('Configuration core.port must be between 0 and 65535')
  }
}