# Configuration Package Documentation

## Overview

The `configuration` package (planned) will provide a robust configuration management system for Node.js services. Currently, the configuration logic is embedded within the `node-service` package but will be extracted into its own package for reusability.

## Current Implementation

The configuration system currently resides in `packages/node-service/config/` and provides:

### Features
- YAML file support for different environments
- Environment variable interpolation
- Hierarchical configuration merging
- Type-safe configuration access
- Default values with environment overrides

### Configuration Files

```
config/
├── index.yaml              # Base configuration
├── node.development.yaml   # Development overrides
├── node.production.yaml    # Production overrides
└── node.test.yaml          # Test environment config
```

### Environment Variable Substitution

Configuration files support environment variable interpolation using `${VAR_NAME}` syntax:

```yaml
database:
  host: ${DB_HOST:localhost}  # Default to localhost
  port: ${DB_PORT:5432}
  password: ${DB_PASSWORD}     # Required, no default
```

## Planned Architecture

### Module Structure
```
packages/configuration/
├── index.ts                 # Main exports
├── ConfigLoader.ts          # Main configuration loader
├── readers/
│   ├── YamlReader.ts        # YAML file reader
│   ├── JsonReader.ts        # JSON file reader
│   └── EnvReader.ts         # Environment variable reader
├── validators/
│   ├── SchemaValidator.ts   # Configuration schema validation
│   └── types.ts             # Validation types
├── interpolation/
│   └── EnvInterpolator.ts   # Environment variable substitution
└── types.ts                 # Configuration types
```

### Usage Pattern (Planned)

```typescript
import { ConfigLoader } from '@amirossanloo/configuration'

// Define configuration schema
interface AppConfig {
  server: {
    port: number
    host: string
  }
  database: {
    url: string
    poolSize: number
  }
}

// Load configuration
const config = await ConfigLoader.load<AppConfig>({
  basePath: './config',
  environment: process.env.NODE_ENV,
  schema: configSchema, // Joi/Zod schema
  defaults: {
    server: { port: 3000, host: '0.0.0.0' },
    database: { poolSize: 10 }
  }
})
```

## Key Features to Implement

### 1. Multiple File Formats
- YAML (current)
- JSON
- TOML
- Environment files (.env)

### 2. Schema Validation
- Joi or Zod integration
- Runtime type checking
- Clear error messages

### 3. Configuration Sources
- Files (YAML, JSON, etc.)
- Environment variables
- Command line arguments
- Remote sources (Consul, etcd)

### 4. Advanced Features
- Hot reloading
- Encrypted values
- Configuration inheritance
- Namespace support

### 5. Developer Experience
- TypeScript generics for type safety
- Detailed error messages
- Configuration debugging tools
- Migration utilities

## Migration Plan

1. Extract current config code from `node-service`
2. Create new `@amirossanloo/configuration` package
3. Add schema validation
4. Implement multiple readers
5. Add hot reload support
6. Update `node-service` to use new package

## Security Considerations

- Sensitive values should be loaded from environment variables
- Support for encrypted configuration values
- Audit trail for configuration changes
- Validation to prevent injection attacks

## Testing Strategy

- Unit tests for each reader/validator
- Integration tests with real config files
- Mock implementations for testing
- Performance benchmarks for large configs