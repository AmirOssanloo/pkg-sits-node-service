import { z } from 'zod'
import {
  ConfigSchema,
  CoreConfigSchema,
  AuthConfigSchema,
  CloudConfigSchema,
  CorsConfigSchema,
  StrategyDefinitionSchema,
} from './schemas.js'

describe('Schema Definitions', () => {
  describe('StrategyDefinitionSchema', () => {
    it('should validate valid strategy definition', () => {
      const valid = {
        provider: 'jwt',
        config: { secret: 'test-secret', expiresIn: '24h' },
      }

      const result = StrategyDefinitionSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should validate strategy without config', () => {
      const valid = { provider: 'oauth' }

      const result = StrategyDefinitionSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject empty provider', () => {
      const invalid = { provider: '' }

      const result = StrategyDefinitionSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Provider name is required')
      }
    })
  })

  describe('AuthConfigSchema', () => {
    it('should validate valid auth config', () => {
      const valid = {
        strategies: {
          jwt: { provider: 'jwt', config: { secret: 'test' } },
          oauth: { provider: 'oauth2' },
        },
        paths: [
          { path: '/api/admin', strategy: 'jwt' },
          { path: '/api/user', strategy: 'oauth' },
        ],
      }

      const result = AuthConfigSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should validate empty strategies and paths', () => {
      const valid = {
        strategies: {},
        paths: [],
      }

      const result = AuthConfigSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })
  })

  describe('CloudConfigSchema', () => {
    it('should validate cloud config with defaults', () => {
      const result = CloudConfigSchema.parse({})

      expect(result).toEqual({
        cluster: '',
        environment: '',
        region: '',
      })
    })

    it('should validate cloud config with values', () => {
      const valid = {
        cluster: 'eu-west-1',
        environment: 'production',
        region: 'eu',
      }

      const result = CloudConfigSchema.parse(valid)
      expect(result).toEqual(valid)
    })
  })

  describe('CorsConfigSchema', () => {
    it('should validate CORS config with defaults', () => {
      const result = CorsConfigSchema.parse({})

      expect(result).toEqual({
        enabled: false,
        origins: null,
        methods: null,
        requestHeaders: null,
        responseHeaders: null,
        supportsCredentials: null,
        maxAge: null,
        endPreflightRequests: null,
      })
    })

    it('should validate enabled CORS with origins', () => {
      const valid = {
        enabled: true,
        origins: ['https://example.com', 'https://app.example.com'],
      }

      const result = CorsConfigSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject invalid URLs in origins', () => {
      const invalid = {
        enabled: true,
        origins: ['not-a-url', 'https://valid.com'],
      }

      const result = CorsConfigSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('CoreConfigSchema', () => {
    it('should validate minimal core config', () => {
      const result = CoreConfigSchema.parse({})

      expect(result.auth).toBeNull()
      expect(result.port).toBe(3000)
      expect(result.cloud.cluster).toBe('')
      expect(result.cors.enabled).toBe(false)
      expect(result.https.enabled).toBe(false)
    })

    it('should validate complete core config', () => {
      const valid = {
        auth: {
          strategies: { jwt: { provider: 'jwt' } },
          paths: [{ path: '/secure', strategy: 'jwt' }],
        },
        cloud: { cluster: 'prod', environment: 'production', region: 'us-east-1' },
        port: 8080,
        cors: { enabled: true, origins: ['https://example.com'] },
        https: { enabled: true, options: { cert: 'cert', key: 'key' } },
      }

      const result = CoreConfigSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('should reject invalid port numbers', () => {
      const testCases = [
        { port: -1, error: 'Port must be 0 or greater' },
        { port: 65536, error: 'Port must be 65535 or less' },
        { port: 3.14, error: 'Invalid input: expected int, received number' },
        { port: '3000', error: 'Invalid input: expected number, received string' },
      ]

      testCases.forEach(({ port, error }) => {
        const result = CoreConfigSchema.safeParse({ port })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(error)
        }
      })
    })
  })

  describe('ConfigSchema', () => {
    it('should validate minimal valid config', () => {
      const valid = {
        name: 'test-service',
        core: {},
      }

      const result = ConfigSchema.parse(valid)
      expect(result.name).toBe('test-service')
      expect(result.core.port).toBe(3000)
    })

    it('should allow custom properties with passthrough', () => {
      const valid = {
        name: 'test-service',
        core: {},
        customProp: 'custom value',
        resources: {
          database: { host: 'localhost', port: 5432 },
        },
      }

      const result = ConfigSchema.parse(valid)
      expect(result.customProp).toBe('custom value')
      expect(result.resources).toEqual({
        database: { host: 'localhost', port: 5432 },
      })
    })

    it('should allow env section', () => {
      const valid = {
        name: 'test-service',
        core: {},
        env: {
          JWT_SECRET: 'secret',
          DATABASE_URL: 'postgres://localhost',
        },
      }

      const result = ConfigSchema.parse(valid)
      expect(result.env).toEqual({
        JWT_SECRET: 'secret',
        DATABASE_URL: 'postgres://localhost',
      })
    })

    it('should reject config without name', () => {
      const invalid = { core: {} }

      const result = ConfigSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'Invalid input: expected string, received undefined'
        )
      }
    })

    it('should reject empty name', () => {
      const invalid = { name: '', core: {} }

      const result = ConfigSchema.safeParse(invalid)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Service name is required')
      }
    })
  })

  describe('Type inference', () => {
    it('should infer correct types from schemas', () => {
      // This test verifies TypeScript type inference works correctly
      const config: z.infer<typeof ConfigSchema> = {
        name: 'test',
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

      // TypeScript will fail to compile if types don't match
      expect(config.name).toBe('test')
      expect(config.core.port).toBe(3000)
    })
  })
})
