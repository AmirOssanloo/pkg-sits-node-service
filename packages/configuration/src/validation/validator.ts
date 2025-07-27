import { ZodError } from 'zod'
import { ConfigValidationError } from './errors.js'
import type { UserConfig } from '../types.js'
import { ConfigSchema } from './schemas.js'

/**
 * Validate a configuration object
 */
export function validateConfig(config: unknown): UserConfig {
  try {
    const result = ConfigSchema.parse(config) as UserConfig

    console.log(result)

    return result as UserConfig
  } catch (error) {
    console.log(error)

    if (error instanceof ZodError) {
      console.log('ZodError')
      throw new ConfigValidationError(error)
    }

    throw error
  }
}

/**
 * Safe validation that returns a result object instead of throwing
 */
export function safeValidateConfig(
  config: unknown
): { success: true; data: UserConfig } | { success: false; error: ConfigValidationError } {
  try {
    const data = validateConfig(config)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      return { success: false, error }
    }
    throw error
  }
}

/**
 * Type guard to check if a value is a valid configuration
 */
export function isValidConfig(value: unknown): value is UserConfig {
  const result = safeValidateConfig(value)
  return result.success
}
