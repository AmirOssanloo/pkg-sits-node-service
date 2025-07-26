import { ConfigValidationError } from './errors.js'
import {
  validateConfig,
  validateConfigAsync,
  safeValidateConfig,
  isValidConfig,
  extractConfigPath,
} from './validator.js'

describe('Validation Utilities', () => {
  const validConfig = {
    name: 'test-service',
    core: {
      auth: null,
      cloud: { cluster: '', environment: '', region: '' },
      port: 3000,
      cors: {
        enabled: false,
        origins: null,
        methods: null,
        requestHeaders: null,
        responseHeaders: null,
        supportsCredentials: null,
        maxAge: null,
        endPreflightRequests: null,
      },
      https: { enabled: false, options: {} },
    },
  }

  describe('validateConfig', () => {
    it('should validate a valid configuration', () => {
      const result = validateConfig(validConfig)
      expect(result).toEqual(validConfig)
    })

    it('should validate config with custom properties in permissive mode', () => {
      const configWithCustom = {
        ...validConfig,
        customProp: 'value',
        resources: { db: { host: 'localhost' } },
      }

      const result = validateConfig(configWithCustom)
      expect(result.customProp).toBe('value')
      expect(result.resources).toEqual({ db: { host: 'localhost' } })
    })

    it('should reject custom properties in strict mode', () => {
      const configWithCustom = {
        ...validConfig,
        customProp: 'value',
      }

      expect(() => validateConfig(configWithCustom, { strict: true })).toThrow(
        ConfigValidationError
      )
    })

    it('should throw ConfigValidationError with formatted message', () => {
      const invalidConfig = {
        name: '',
        core: { port: 'not-a-number' },
      }

      try {
        validateConfig(invalidConfig)
        fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ConfigValidationError)
        const err = error as ConfigValidationError
        expect(err.message).toContain('Configuration validation failed:')
        expect(err.message).toContain('name: Service name is required')
        expect(err.message).toContain('core.port: Invalid input: expected number, received string')
        expect(err.issues).toHaveLength(2)
      }
    })

    it('should validate with default values', () => {
      const minimalConfig = {
        name: 'test-service',
        core: {},
      }

      const result = validateConfig(minimalConfig)
      expect(result.core.port).toBe(3000)
      expect(result.core.cors.enabled).toBe(false)
    })
  })

  describe('validateConfigAsync', () => {
    it('should validate asynchronously', async () => {
      const result = await validateConfigAsync(validConfig)
      expect(result).toEqual(validConfig)
    })

    it('should reject invalid config asynchronously', async () => {
      const invalidConfig = { name: '' }

      await expect(validateConfigAsync(invalidConfig)).rejects.toThrow(ConfigValidationError)
    })
  })

  describe('safeValidateConfig', () => {
    it('should return success result for valid config', () => {
      const result = safeValidateConfig(validConfig)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validConfig)
      }
    })

    it('should return error result for invalid config', () => {
      const invalidConfig = { name: '', core: {} }

      const result = safeValidateConfig(invalidConfig)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ConfigValidationError)
        expect(result.error.message).toContain('Service name is required')
      }
    })

    it('should not throw for validation errors', () => {
      const invalidConfig = {
        name: 'test',
        core: { port: 'invalid' },
      }

      expect(() => safeValidateConfig(invalidConfig)).not.toThrow()
    })
  })

  describe('isValidConfig', () => {
    it('should return true for valid config', () => {
      expect(isValidConfig(validConfig)).toBe(true)
    })

    it('should return false for invalid config', () => {
      expect(isValidConfig({})).toBe(false)
      expect(isValidConfig({ name: '' })).toBe(false)
      expect(isValidConfig({ name: 'test' })).toBe(false) // missing core
      expect(isValidConfig(null)).toBe(false)
      expect(isValidConfig(undefined)).toBe(false)
    })

    it('should work as type guard', () => {
      const unknown: unknown = validConfig

      if (isValidConfig(unknown)) {
        // TypeScript should recognize this as Config type
        expect(unknown.name).toBe('test-service')
        expect(unknown.core.port).toBe(3000)
      }
    })
  })

  describe('extractConfigPath', () => {
    const config = {
      ...validConfig,
      resources: {
        database: {
          host: 'localhost',
          port: 5432,
          credentials: {
            user: 'admin',
            password: 'secret',
          },
        },
        cache: {
          url: 'redis://localhost:6379',
        },
      },
    }

    it('should extract nested paths', () => {
      expect(extractConfigPath<string>(config, 'name')).toBe('test-service')
      expect(extractConfigPath<number>(config, 'core.port')).toBe(3000)
      expect(extractConfigPath<boolean>(config, 'core.cors.enabled')).toBe(false)
      expect(extractConfigPath<string>(config, 'resources.database.host')).toBe('localhost')
      expect(extractConfigPath<object>(config, 'resources.database.credentials')).toEqual({
        user: 'admin',
        password: 'secret',
      })
    })

    it('should return undefined for non-existent paths', () => {
      expect(extractConfigPath(config, 'nonexistent')).toBeUndefined()
      expect(extractConfigPath(config, 'core.nonexistent')).toBeUndefined()
      expect(extractConfigPath(config, 'resources.database.nonexistent')).toBeUndefined()
      expect(extractConfigPath(config, 'a.b.c.d.e')).toBeUndefined()
    })

    it('should handle edge cases', () => {
      expect(extractConfigPath(config, '')).toEqual(config)
      expect(extractConfigPath(config, 'core.auth')).toBeNull()
      expect(extractConfigPath({} as any, 'any.path')).toBeUndefined()
    })
  })

  describe('ConfigValidationError', () => {
    it('should format multiple validation issues', () => {
      const invalidConfig = {
        name: '',
        core: {
          port: -1,
          cors: {
            origins: ['not-a-url'],
          },
        },
      }

      try {
        validateConfig(invalidConfig)
      } catch (error) {
        const err = error as ConfigValidationError
        expect(err.name).toBe('ConfigValidationError')
        expect(err.issues).toHaveLength(3)
        expect(err.issues[0].path).toBe('name')
        expect(err.issues[1].path).toBe('core.port')
        expect(err.issues[2].path).toBe('core.cors.origins.0')
      }
    })

    it('should preserve original ZodError', () => {
      try {
        validateConfig({ name: '' })
      } catch (error) {
        const err = error as ConfigValidationError
        expect(err.zodError).toBeDefined()
        expect(err.zodError.issues).toBeDefined()
      }
    })
  })
})
