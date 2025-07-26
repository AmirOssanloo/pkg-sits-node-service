import config from '@sits/configuration'
import { z } from 'zod'

/**
 * Node Service configuration schema
 */
export const nodeServiceConfigSchema = z.object({
  service: z.object({
    name: z.string().min(1).default('node-service'),
    version: z.string().default('1.0.0'),
    environment: z.enum(['development', 'test', 'staging', 'production']).default('development'),
    port: z.number().int().min(1).max(65535).default(3000),
    host: z.string().default('0.0.0.0'),
    baseUrl: z.string().url().optional(),

    // Logging configuration
    logging: z
      .object({
        level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
        format: z.enum(['json', 'pretty']).default('json'),
        silent: z.boolean().default(false),
      })
      .optional(),

    // Server configuration
    server: z.object({
      trustProxy: z.boolean().default(false),
      timeout: z.number().positive().default(60000), // 60 seconds
      keepAliveTimeout: z.number().positive().default(65000), // 65 seconds
      headersTimeout: z.number().positive().default(66000), // 66 seconds
      maxHeaderSize: z.number().positive().default(16384), // 16KB
    }),

    // Middleware configuration
    middleware: z.object({
      // CORS configuration
      cors: z.object({
        enabled: z.boolean().default(true),
        origin: z
          .union([
            z.boolean(),
            z.string(),
            z.array(z.string()),
            z.any(), // Function type for CORS origin callback
          ])
          .default(true),
        credentials: z.boolean().default(true),
        methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
        allowedHeaders: z.array(z.string()).optional(),
        exposedHeaders: z.array(z.string()).optional(),
        maxAge: z.number().positive().optional(),
        preflightContinue: z.boolean().default(false),
        optionsSuccessStatus: z.number().default(204),
      }),

      // Helmet configuration
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

      // Authentication configuration
      auth: z.object({
        enabled: z.boolean().default(false),
        secret: z.string().min(32).optional(),
        algorithms: z.array(z.string()).default(['HS256']),
        credentialsRequired: z.boolean().default(true),
        requestProperty: z.string().default('user'),
        securePaths: z.array(z.string()).default([]),
        ignorePaths: z.array(z.string()).default(['/health', '/ping', '/metrics']),
      }),

      // Rate limiting configuration
      rateLimit: z.object({
        enabled: z.boolean().default(false),
        windowMs: z
          .number()
          .positive()
          .default(15 * 60 * 1000), // 15 minutes
        max: z.number().positive().default(100),
        message: z.string().default('Too many requests from this IP, please try again later.'),
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
          type: z.union([z.string(), z.array(z.string())]).default('application/octet-stream'),
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
  }),
})

/**
 * Type for the node service configuration
 */
export type NodeServiceConfig = z.infer<typeof nodeServiceConfigSchema>

/**
 * Get validated configuration
 */
export function getServiceConfig(): NodeServiceConfig {
  try {
    // Get raw configuration from @sits/configuration
    const rawConfig = config as any

    // Validate and return
    return nodeServiceConfigSchema.parse(rawConfig)
  } catch (error) {
    // If validation fails, return defaults
    console.warn('Configuration validation failed, using defaults:', error)
    return nodeServiceConfigSchema.parse({})
  }
}

/**
 * Helper to get nested configuration values with defaults
 */
export function getConfigValue<T>(path: string, defaultValue: T): T {
  const parts = path.split('.')
  let value: any = getServiceConfig()

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part]
    } else {
      return defaultValue
    }
  }

  return value as T
}

// Export the default configuration
export const defaultConfig = nodeServiceConfigSchema.parse({})
