import { mergeDeepRight } from 'ramda'
import type { Config, UserConfig } from '../types.js'
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