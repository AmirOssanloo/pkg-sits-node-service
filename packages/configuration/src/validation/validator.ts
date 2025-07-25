import { z, ZodError } from 'zod'
import type { Config, UserConfig, ValidationOptions } from './schemas.js'
import { ConfigSchema, BaseConfigSchema, defaultValidationOptions } from './schemas.js'
import { ConfigValidationError, type ValidationIssue } from './errors.js'

/**
 * Validates a configuration object against the schema
 * @param config The configuration to validate
 * @param options Validation options
 * @returns The validated configuration
 * @throws {ZodError} If validation fails
 */
export function validateConfig(
  config: unknown,
  options: ValidationOptions = {}
): Config {
  const opts = { ...defaultValidationOptions, ...options }
  
  try {
    // Create schema based on options
    // In strict mode, use BaseConfigSchema with .strict() to disallow unknown properties
    // Default mode uses ConfigSchema which allows additional properties
    const schema = opts.strict ? BaseConfigSchema.strict() : ConfigSchema
    
    // Validate with options
    const result = schema.parse(config)
    
    return result as Config
  } catch (error) {
    if (error instanceof ZodError) {
      // Enhance error message for better debugging
      throw new ConfigValidationError(error)
    }
    throw error
  }
}

/**
 * Validates a configuration object asynchronously
 * Useful for async transformations or refinements
 */
export async function validateConfigAsync(
  config: unknown,
  options: ValidationOptions = {}
): Promise<Config> {
  const opts = { ...defaultValidationOptions, ...options }
  
  try {
    const schema = opts.strict ? BaseConfigSchema : ConfigSchema
    
    const result = await schema.parseAsync(config)
    
    return result as Config
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ConfigValidationError(error)
    }
    throw error
  }
}

/**
 * Safe validation that returns a result object instead of throwing
 */
export function safeValidateConfig(
  config: unknown,
  options: ValidationOptions = {}
): { success: true; data: Config } | { success: false; error: ConfigValidationError } {
  try {
    const data = validateConfig(config, options)
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
export function isValidConfig(value: unknown): value is Config {
  const result = safeValidateConfig(value)
  return result.success
}

/**
 * Extracts partial configuration for specific paths
 */
export function extractConfigPath<T>(
  config: Config,
  path: string
): T | undefined {
  if (!path) {
    return config as unknown as T
  }
  
  const parts = path.split('.')
  let current: any = config
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return undefined
    }
  }
  
  return current as T
}