# Configuration Examples

## Basic Configuration

The configuration system uses a base configuration file (`config/index.yaml`) that defines the service structure:

```yaml
name: my-service
core:
  # Authentication configuration
  auth: null # Set to null to disable authentication

  # Cloud deployment information
  cloud:
    cluster: ''
    environment: ''
    region: ''

  # Server port
  port: 3000

  # CORS configuration
  cors:
    enabled: false
    origins: null
    methods: null
    requestHeaders: null
    responseHeaders: null
    supportsCredentials: null
    maxAge: null
    endPreflightRequests: null

  # HTTPS configuration
  https:
    enabled: false
    options: {}
```

## Environment-Specific Overrides

Create environment-specific files like `config/node.development.yaml`:

```yaml
core:
  port: 3021
  cors:
    enabled: true
    origins:
      - http://localhost:3000
      - http://localhost:5173
    methods:
      - GET
      - POST
      - PUT
      - DELETE
      - OPTIONS
```

## Authentication Example

To enable JWT authentication:

```yaml
name: secure-service
core:
  auth:
    strategies:
      jwt:
        provider: jwt
        config:
          secret: ${JWT_SECRET}
          expiresIn: '24h'
    paths:
      - path: /api/admin
        strategy: jwt
      - path: /api/user
        strategy: jwt
```

## Custom Configuration Properties

You can add any custom properties outside the `core` namespace:

```yaml
name: my-service
core:
  # ... core configuration

# Custom properties
resources:
  database:
    host: localhost
    port: 5432
    name: myapp
    user: ${DB_USER}
    password: ${DB_PASSWORD}

  redis:
    host: localhost
    port: 6379

  s3:
    bucket: my-app-uploads
    region: us-east-1

features:
  emailNotifications: true
  analytics: false

limits:
  maxUploadSize: 10485760 # 10MB
  requestsPerMinute: 100
```

## Environment Variables

Use the `env` section to set environment variables:

```yaml
env:
  JWT_SECRET: my-secret-key
  DB_USER: appuser
  DB_PASSWORD: secret123
  NODE_ENV: development
```

In production, the `env` section is automatically removed from the configuration object for security.

## Programmatic Usage

```typescript
import config from '@sits/configuration'
import { validateConfig, ConfigSchema, isValidConfig } from '@sits/configuration'
import { z } from 'zod'

// Access core configuration
console.log(config.core.port)
console.log(config.core.cors.enabled)

// Access custom properties
console.log(config.resources?.database?.host)
console.log(config.features?.emailNotifications)

// Type-safe access with interfaces
interface MyConfig extends Config {
  resources?: {
    database?: {
      host: string
      port: number
      name: string
    }
  }
  features?: {
    emailNotifications: boolean
    analytics: boolean
  }
}

const typedConfig = config as MyConfig

// Validate custom configuration
const MyConfigSchema = ConfigSchema.extend({
  resources: z
    .object({
      database: z.object({
        host: z.string(),
        port: z.number(),
        name: z.string(),
      }),
    })
    .optional(),
})

// Runtime validation
try {
  const validatedConfig = validateConfig(myConfig)
  console.log('Configuration is valid!')
} catch (error) {
  console.error('Configuration errors:', error.message)
}

// Strict validation (no unknown properties allowed)
const strictConfig = validateConfig(myConfig, { strict: true })

// Type guard
if (isValidConfig(unknownConfig)) {
  // TypeScript knows this is a valid Config
  console.log(unknownConfig.core.port)
}
```

## Schema Extension

You can extend the base schemas for custom validation. Use `BaseConfigSchema` for strict validation or `ConfigSchema` for allowing additional properties:

```typescript
import { CoreConfigSchema, ConfigSchema } from '@sits/configuration'
import { z } from 'zod'

// Extend core config
const MyCustomCoreSchema = CoreConfigSchema.extend({
  customSetting: z.string().default('default-value'),
})

// Create fully custom config schema
const MyServiceConfigSchema = ConfigSchema.extend({
  core: MyCustomCoreSchema,
  features: z.object({
    rateLimit: z.object({
      enabled: z.boolean(),
      maxRequests: z.number().int().positive(),
      windowMs: z.number().int().positive(),
    }),
  }),
})

// Use for validation
const config = MyServiceConfigSchema.parse(rawConfig)
```
