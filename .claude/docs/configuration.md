# Configuration Package Documentation

## Overview

The `@sits/configuration` package provides a robust, type-safe configuration management system for Node.js services. It features YAML-based configuration with environment-specific overrides, TypeScript type definitions, and default value support.

## Current Implementation

### Features

- **YAML-based configuration** with environment-specific overrides
- **Zod schema validation** with runtime type checking and clear error messages
- **TypeScript type definitions** auto-generated from Zod schemas
- **Default configuration** with deep merging
- **Environment variable support** via `env` section
- **Dual ESM/CJS build** for maximum compatibility
- **Extensible design** allowing custom properties
- **Validation modes** supporting both strict and permissive validation
- **Schema extension** support for custom validation rules

### Package Structure

```
packages/configuration/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript type definitions
│   ├── core/
│   │   ├── assemble.ts       # Configuration assembly logic
│   │   ├── defaults.ts       # Default configuration values
│   │   └── merge.ts          # Configuration merging utilities
│   ├── loaders/
│   │   └── yaml.ts           # YAML file reading
│   ├── processors/
│   │   └── env.ts            # Environment variable processing
│   └── validation/
│       ├── schemas.ts        # Zod schema definitions
│       ├── validator.ts      # Validation functions
│       └── errors.ts         # Custom error handling
├── EXAMPLE.md                # Usage examples and validation guide
└── package.json              # Package configuration
```

### Configuration Structure

The configuration uses a `core` namespace for framework settings and allows custom properties:

```typescript
interface Config {
  name: string // Service name (required)
  core: CoreConfig // Framework configuration
  [key: string]: any // Custom properties
}

interface CoreConfig {
  auth: AuthConfig | null // Authentication settings
  cloud: CloudConfig // Cloud deployment info
  port: number // Server port (default: 3000)
  cors: CorsConfig // CORS settings
  https: HttpsConfig // HTTPS configuration
}
```

### Configuration Files

```
config/
├── index.yaml              # Base configuration
├── node.development.yaml   # Development overrides
├── node.production.yaml    # Production overrides
└── node.test.yaml          # Test environment config
```

### Usage

```typescript
import config from '@sits/configuration'

// Access core configuration
console.log(config.core.port) // 3000
console.log(config.core.cors.enabled) // false

// Access custom properties
console.log(config.myCustomProperty)
```

### Schema Validation

The package uses Zod for runtime schema validation with comprehensive error handling:

```typescript
import { 
  validateConfig, 
  validateConfigAsync, 
  safeValidateConfig,
  isValidConfig,
  ConfigSchema 
} from '@sits/configuration'

// Runtime validation
try {
  const validatedConfig = validateConfig(userConfig)
  console.log('Configuration is valid!')
} catch (error) {
  // Detailed error with path information
  console.error('Validation errors:', error.issues)
  /*
  Output example:
  [
    { path: "core.port", message: "Expected number, received string" },
    { path: "core.cors.origins.0", message: "Invalid URL" }
  ]
  */
}

// Safe validation (returns result object)
const result = safeValidateConfig(userConfig)
if (result.success) {
  console.log('Valid config:', result.data)
} else {
  console.error('Validation failed:', result.error.issues)
}

// Type guard validation
if (isValidConfig(unknownConfig)) {
  // TypeScript knows this is a valid Config
  console.log(unknownConfig.core.port)
}

// Async validation for large configs
const asyncResult = await validateConfigAsync(largeConfig)
```

### Validation Modes

```typescript
// Strict mode: Rejects unknown properties
const strictConfig = validateConfig(userConfig, { strict: true })

// Permissive mode (default): Allows unknown properties
const permissiveConfig = validateConfig(userConfig, { strict: false })
```

### Schema Extension

Extend schemas for custom validation:

```typescript
import { ConfigSchema, CoreConfigSchema } from '@sits/configuration'
import { z } from 'zod'

// Extend the core schema
const MyCustomCoreSchema = CoreConfigSchema.extend({
  customFeature: z.object({
    enabled: z.boolean(),
    maxItems: z.number().int().positive()
  })
})

// Create custom config schema
const MyConfigSchema = ConfigSchema.extend({
  core: MyCustomCoreSchema,
  resources: z.object({
    database: z.object({
      host: z.string().url(),
      port: z.number().int().min(1).max(65535)
    })
  }).optional()
})

// Use for validation
const myConfig = MyConfigSchema.parse(rawConfig)
```

### Environment Variables

Set environment variables via the `env` section:

```yaml
env:
  JWT_SECRET: my-secret-key
  DATABASE_URL: postgres://localhost:5432/mydb
```

These are applied to `process.env` and removed from the config object in production.

## Configuration Merging

The system merges configurations in this order:

1. **Default configuration** (from `defaults.ts`)
2. **Base configuration** (`config/index.yaml`)
3. **Environment-specific** (`config/node.{NODE_ENV}.yaml`)

Later values override earlier ones using deep merge.

## Type Safety

Full TypeScript support with exported types:

```typescript
import type { Config, CoreConfig, UserConfig } from '@sits/configuration'

// Extend for custom properties
interface MyConfig extends Config {
  resources?: {
    database?: {
      host: string
      port: number
    }
  }
}
```

## Schema Validation

The configuration package now includes comprehensive schema validation using Zod:

### Features

- **Runtime validation** - Configurations are validated when loaded
- **Clear error messages** - Detailed paths and descriptions for validation failures
- **Type inference** - Schemas provide TypeScript types automatically
- **Extensible schemas** - Export schemas for custom validation rules
- **Validation modes** - Strict mode (BaseConfigSchema) rejects unknown properties, permissive mode (ConfigSchema) allows them

### Usage

```typescript
import { validateConfig, ConfigSchema } from '@sits/configuration'

// Validate a configuration object
try {
  const config = validateConfig(myConfig)
} catch (error) {
  // ConfigValidationError with detailed issues
  console.error(error.message)
}

// Safe validation (no throwing)
const result = safeValidateConfig(myConfig)
if (result.success) {
  console.log(result.data)
} else {
  console.error(result.error.issues)
}

// Extend schemas for custom validation
const MyConfigSchema = ConfigSchema.extend({
  myCustomField: z.string().min(1),
})
```

### Error Format

```
Configuration validation failed:
  - core.port: Expected number, received string
  - core.cors.origins.0: Invalid URL
  - name: Service name is required
```

## Upcoming Features

### Future Enhancements

- Hot reloading for development
- Remote configuration sources
- Encrypted value support
- Environment variable interpolation in YAML
- CLI configuration tools

## Best Practices

1. **Use the `core` namespace** for framework settings
2. **Add custom properties** at the root level
3. **Sensitive values** should use environment variables
4. **Document custom properties** in your service README
5. **Test configuration** in all target environments

## Migration from Embedded Config

If migrating from the old embedded configuration:

1. Update imports from `@sits/node-service/config` to `@sits/configuration`
2. Change `sns.*` references to `core.*`
3. Update any custom configuration to use the new structure

## Security Considerations

- Environment variables in `env` section are removed in production
- Never commit sensitive values to configuration files
- Use environment-specific files on secure deployment systems
- Validate all configuration values before use

## Testing

The package includes comprehensive tests for:

- Configuration file reading
- Environment merging
- Default value application
- Type safety verification
