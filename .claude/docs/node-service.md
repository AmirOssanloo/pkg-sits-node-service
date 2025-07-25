# Node Service Framework Documentation

## Overview

The `node-service` package is a lightweight Node.js framework for building HTTP services with minimal boilerplate. Built on Express 5, it provides server lifecycle management, configuration, middleware, and health checks out of the box.

## Architecture

The framework follows a three-layer architecture:

### 1. Core Layer
Essential functionality that every service needs:
- `createNodeService`: Main factory function for creating services
- `createApp`: Sets up the Express application with middleware
- `bootApp`: Handles server startup and graceful shutdown
- `createServer`: HTTP server creation and management

### 2. Plugins Layer
Optional middleware and features:
- **Authentication**: JWT-based auth middleware with secure/public path routing
- **Correlation ID**: Request tracking across services
- **Context**: Request context propagation
- **Logging**: Structured logging with request metadata
- **CORS**: Cross-origin resource sharing configuration
- **Error Handling**: Global error handler middleware

### 3. Adapters Layer
Framework integrations:
- Express 5 as the primary web server
- Native Express middleware support
- Cookie parser, helmet for security
- YAML configuration file support

## Directory Structure

```
packages/node-service/
├── index.ts                          # Package exports
├── createNodeService.ts              # Main service factory
├── createApp.ts                      # Express app setup
├── bootApp.ts                        # Server bootstrap & shutdown
├── createServer.ts                   # HTTP server creation
├── createGracefulShutdown.ts         # Graceful shutdown logic
├── config/                           # Configuration management
│   ├── index.ts                      # Config exports
│   ├── assembleConfig.ts             # Config assembly logic
│   ├── applyEnv.ts                   # Environment variable overrides
│   └── readConfigFile.ts             # YAML file reader
├── middleware/                       # Express middleware
│   ├── auth/                         # Authentication middleware
│   ├── context.ts                    # Request context
│   ├── correlationId.ts              # Request tracking
│   ├── cors.ts                       # CORS setup
│   └── logger.ts                     # Request logging
├── errors/                           # Error definitions
├── utils/                            # Utilities
│   └── logger.ts                     # Logger instance
└── types.d.ts                        # TypeScript definitions
```

## Usage Pattern

```typescript
import { NodeService } from '@amirossanloo/node-service'

// 1. Create service instance
const { app, setup, logger } = NodeService()

// 2. Define routes (Express style)
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' })
})

// 3. Setup and run
const { run } = await setup()
run({ releaseResources: async () => { /* cleanup */ } })
```

## Configuration

The framework uses YAML configuration files with environment variable overrides:

```yaml
# config/node.development.yaml
sns:
  name: my-service
  port: 3000
  auth:
    jwt:
      secret: ${JWT_SECRET}
    securePaths:
      - /api/admin
      - /api/user
```

## Middleware Chain

The middleware chain in `createApp.ts` includes:
1. CORS (cross-origin requests)
2. Helmet (security headers)
3. Cookie Parser
4. Context (request context)
5. Authentication (JWT validation)
6. Correlation ID (request tracking)
7. Logger (request/response logging)

## Testing

- Unit tests use Jest with TypeScript support
- Test files follow `*.spec.ts` naming convention
- Mock implementations for testing middleware in isolation

## Future Enhancements

1. **Plugin System**: Implement register(app, config) contract for all plugins
2. **Configuration Package**: Extract config management with typed ConfigProvider
3. **Error Package**: Standardized error handling across services
4. **Metrics Plugin**: Built-in metrics collection (Prometheus adapter)
5. **Health Checks Plugin**: Enhanced health check system with dependencies
6. **OpenAPI Plugin**: Auto-generated API documentation
7. **Test Kit**: In-memory service harness for downstream testing