import { ConfigValidationError } from './errors.js'
import { validateConfig } from './validator.js'
import { getDefaultConfig } from '../core/defaults.js'

describe('validateConfig', () => {
  const validConfig = getDefaultConfig()

  it('should validate a valid configuration', () => {
    const result = validateConfig(validConfig)
    expect(result).toEqual(validConfig)
  })

  it('should validate config with custom properties', () => {
    const customConfig = {
      ...validConfig,
      resources: { db: { host: 'localhost' } },
      customProperty: 'value',
    }

    const result = validateConfig(customConfig)
    expect(result.customProperty).toBe('value')
    expect(result.resources).toEqual({ db: { host: 'localhost' } })
  })

  it('should throw error with formatted message', () => {
    const invalidConfig = {
      name: '', // Empty string - will fail min(1) validation
      core: {
        server: {
          port: 'invalid-value', // String instead of number
        },
      },
    }

    try {
      validateConfig(invalidConfig)
      fail('Should have thrown')
    } catch (error) {
      const err = error as ConfigValidationError

      expect(error).toBeInstanceOf(ConfigValidationError)
      expect(err.issues).toHaveLength(2)
    }
  })

  it('should validate with default values', () => {
    const minimalConfig = {
      name: 'test-service',
      core: {},
    }

    const result = validateConfig(minimalConfig)
    expect(result.core.server.port).toBe(3000)
    expect(result.core.auth).toBeNull()
  })
})
