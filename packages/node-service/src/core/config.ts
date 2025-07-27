import config, { ConfigSchema, extractConfigPath } from '@sits/configuration'
import { z } from 'zod'

/**
 * Node Service specific configuration extensions
 * These are fields that extend the base configuration from @sits/configuration
 */
export const nodeServiceExtensionsSchema = z.object({
  nodeService: z.object({
      version: z.string().default('1.0.0'),
      environment: z.enum(['development', 'test', 'staging', 'production']).default('development'),
      host: z.string().default('0.0.0.0'),
      baseUrl: z.string().url().optional(),

      // Logging configuration
      logging: z.object({
        level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
        format: z.enum(['json', 'pretty']).default('json'),
        silent: z.boolean().default(false),
      }),

      // Server configuration
      server: z.object({
        trustProxy: z.boolean().default(false),
        timeout: z.number().positive().default(60000), // 60 seconds
        keepAliveTimeout: z.number().positive().default(65000), // 65 seconds
        headersTimeout: z.number().positive().default(66000), // 66 seconds
        maxHeaderSize: z.number().positive().default(16384), // 16KB
      }),

      // Middleware configuration extensions
      middleware: z.object({
        // Helmet configuration (not in core)
        helmet: z.object({
          enabled: z.boolean().default(true),
          contentSecurityPolicy: z.union([z.boolean(), z.object({})]).default(false),
          crossOriginEmbedderPolicy: z.boolean().default(true),
          crossOriginOpenerPolicy: z.boolean().default(true),
          crossOriginResourcePolicy: z.boolean().default(true),
          dnsPrefetchControl: z.boolean().default(true),
          frameguard: z.boolean().default(true),
          hidePoweredBy: z.boolean().default(true),
          hsts: z.boolean().default(true),
          ieNoOpen: z.boolean().default(true),
          noSniff: z.boolean().default(true),
          originAgentCluster: z.boolean().default(true),
          permittedCrossDomainPolicies: z.boolean().default(false),
          referrerPolicy: z.boolean().default(true),
          xssFilter: z.boolean().default(true),
        }),

        // Rate limiting configuration
        rateLimit: z.object({
          enabled: z.boolean().default(false),
          windowMs: z
            .number()
            .positive()
            .default(15 * 60 * 1000), // 15 minutes
          max: z.number().positive().default(100),
          message: z
            .string()
            .default('Too many requests from this IP, please try again later.'),
          standardHeaders: z.boolean().default(true),
          legacyHeaders: z.boolean().default(false),
        }),

        // Body parser configuration
        bodyParser: z.object({
          json: z.object({
            limit: z.string().default('10mb'),
            strict: z.boolean().default(true),
            type: z.union([z.string(), z.array(z.string())]).default('application/json'),
          }),
          urlencoded: z.object({
            extended: z.boolean().default(true),
            limit: z.string().default('10mb'),
            parameterLimit: z.number().default(1000),
          }),
          raw: z.object({
            enabled: z.boolean().default(false),
            limit: z.string().default('10mb'),
            type: z
              .union([z.string(), z.array(z.string())])
              .default('application/octet-stream'),
          }),
          text: z.object({
            enabled: z.boolean().default(false),
            limit: z.string().default('10mb'),
            type: z.union([z.string(), z.array(z.string())]).default('text/plain'),
          }),
        }),
      }),

      // Health check configuration
      health: z.object({
        enabled: z.boolean().default(true),
        path: z.string().default('/health'),
        timeout: z.number().positive().default(5000),
        checks: z
          .array(
            z.object({
              name: z.string(),
              check: z.any(), // Function that returns a promise
            })
          )
          .default([]),
      }),

      // Metrics configuration
      metrics: z.object({
        enabled: z.boolean().default(false),
        path: z.string().default('/metrics'),
        includeDefaults: z.boolean().default(true),
      }),

      // Graceful shutdown configuration
      shutdown: z.object({
        enabled: z.boolean().default(true),
        timeout: z.number().positive().default(30000), // 30 seconds
        signals: z.array(z.string()).default(['SIGTERM', 'SIGINT']),
        forceExitAfter: z.number().positive().optional(),
      }),
    }).optional(),
})

/**
 * Complete Node Service configuration schema
 * Extends the base configuration with node-service specific fields
 */
export const nodeServiceConfigSchema = ConfigSchema.and(nodeServiceExtensionsSchema)

/**
 * Type for the complete node service configuration
 */
export type NodeServiceConfig = z.infer<typeof nodeServiceConfigSchema>

/**
 * Get validated configuration
 */
export function getServiceConfig(): NodeServiceConfig {
  try {
    // Validate the configuration using the extended schema
    return nodeServiceConfigSchema.parse(config)
  } catch {
    // If validation fails, merge defaults with whatever valid config we have
    const defaults = nodeServiceConfigSchema.parse({
      name: config.name || 'node-service',
      core: {},
      nodeService: {
        logging: {},
        server: {},
        middleware: {
          helmet: {},
          rateLimit: {},
          bodyParser: {
            json: {},
            urlencoded: {},
            raw: {},
            text: {},
          },
        },
        health: {},
        metrics: {},
        shutdown: {},
      },
    })

    // Try to merge in any valid parts of the config
    return { ...defaults, ...config } as NodeServiceConfig
  }
}

/**
 * Helper to get nested configuration values with defaults
 * This maintains backward compatibility with existing code
 */
export function getConfigValue<T>(path: string, defaultValue: T): T {
  // Map old paths to new structure
  const pathMapping: Record<string, string> = {
    'service.name': 'name',
    'service.version': 'nodeService.version',
    'service.environment': 'nodeService.environment',
    'service.port': 'core.port',
    'service.host': 'nodeService.host',
    'service.baseUrl': 'nodeService.baseUrl',
    'service.logging': 'nodeService.logging',
    'service.logging.level': 'nodeService.logging.level',
    'service.logging.format': 'nodeService.logging.format',
    'service.logging.silent': 'nodeService.logging.silent',
    'service.server': 'nodeService.server',
    'service.middleware.cors': 'core.cors',
    'service.middleware.helmet': 'nodeService.middleware.helmet',
    'service.middleware.bodyParser': 'nodeService.middleware.bodyParser',
    'service.middleware.rateLimit': 'nodeService.middleware.rateLimit',
    'service.health': 'nodeService.health',
    'service.metrics': 'nodeService.metrics',
    'service.shutdown': 'nodeService.shutdown',
  }

  const mappedPath = pathMapping[path] || path
  const value = extractConfigPath<T>(getServiceConfig(), mappedPath)
  return value !== undefined ? value : defaultValue
}

// Export for backward compatibility
export const defaultConfig = nodeServiceConfigSchema.parse({
  name: 'node-service',
  core: {},
  nodeService: {
    logging: {},
    server: {},
    middleware: {
      helmet: {},
      rateLimit: {},
      bodyParser: {
        json: {},
        urlencoded: {},
        raw: {},
        text: {},
      },
    },
    health: {},
    metrics: {},
    shutdown: {},
  },
})