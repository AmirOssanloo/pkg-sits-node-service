# Node Service Configuration

The node-service package uses the `@sits/configuration` package for configuration management. Configuration is loaded from YAML files and can be overridden with environment variables.

## Configuration Structure

Create a `config/default.yaml` file in your project root:

```yaml
service:
  name: my-service
  version: 1.0.0
  environment: development
  port: 3000
  host: 0.0.0.0
  
  logging:
    level: info
    format: json
    silent: false
    
  server:
    trustProxy: false
    timeout: 60000
    keepAliveTimeout: 65000
    headersTimeout: 66000
    maxHeaderSize: 16384
    
  middleware:
    cors:
      enabled: true
      origin: true
      credentials: true
      methods:
        - GET
        - POST
        - PUT
        - DELETE
        - PATCH
        - OPTIONS
        
    helmet:
      enabled: true
      contentSecurityPolicy: false
      
    auth:
      enabled: false
      secret: your-secret-key-min-32-chars
      algorithms:
        - HS256
      credentialsRequired: true
      securePaths: []
      ignorePaths:
        - /health
        - /ping
        - /metrics
        
    rateLimit:
      enabled: false
      windowMs: 900000 # 15 minutes
      max: 100
      
    bodyParser:
      json:
        limit: 10mb
        strict: true
      urlencoded:
        extended: true
        limit: 10mb
        parameterLimit: 1000
        
  health:
    enabled: true
    path: /health
    timeout: 5000
    
  metrics:
    enabled: false
    path: /metrics
    includeDefaults: true
    
  shutdown:
    enabled: true
    timeout: 30000
    signals:
      - SIGTERM
      - SIGINT
```

## Environment Variables

All configuration values can be overridden using environment variables. Use the `__` separator for nested properties:

```bash
# Override service configuration
SERVICE__NAME=my-app
SERVICE__PORT=8080
SERVICE__ENVIRONMENT=production

# Override logging
SERVICE__LOGGING__LEVEL=debug
SERVICE__LOGGING__FORMAT=pretty

# Override middleware settings
SERVICE__MIDDLEWARE__CORS__ENABLED=false
SERVICE__MIDDLEWARE__AUTH__ENABLED=true
SERVICE__MIDDLEWARE__AUTH__SECRET=my-secret-key-with-min-32-characters

# Override rate limiting
SERVICE__MIDDLEWARE__RATELIMIT__ENABLED=true
SERVICE__MIDDLEWARE__RATELIMIT__MAX=50
```

## Using Configuration in Code

```typescript
import { getServiceConfig, getConfigValue } from '@sits/node-service'

// Get the full configuration object
const config = getServiceConfig()
console.log(config.service.name) // 'my-service'

// Get specific configuration values with defaults
const port = getConfigValue('service.port', 3000)
const logLevel = getConfigValue('service.logging.level', 'info')

// Access nested configuration
const corsEnabled = config.service.middleware.cors.enabled
const authSecret = config.service.middleware.auth.secret
```

## Configuration Validation

All configuration is validated using Zod schemas. If validation fails, default values are used. You can see the full schema in `src/core/config.ts`.

## Environment-Specific Configuration

Create environment-specific configuration files:

- `config/development.yaml`
- `config/test.yaml`
- `config/staging.yaml`
- `config/production.yaml`

Set the `NODE_ENV` environment variable to load the appropriate configuration:

```bash
NODE_ENV=production node server.js
```

## Configuration Precedence

Configuration is loaded in the following order (later sources override earlier ones):

1. Default values from schema
2. `config/default.yaml`
3. `config/{NODE_ENV}.yaml`
4. Environment variables

## Security Considerations

- **Never commit secrets** to configuration files
- Use environment variables for sensitive data
- Ensure JWT secrets are at least 32 characters
- Use strong passwords for database connections
- Enable HTTPS in production environments

## Common Configuration Patterns

### Development Configuration

```yaml
service:
  environment: development
  logging:
    level: debug
    format: pretty
  middleware:
    cors:
      origin: http://localhost:3001
    helmet:
      contentSecurityPolicy: false
```

### Production Configuration

```yaml
service:
  environment: production
  logging:
    level: warn
    format: json
  server:
    trustProxy: true
  middleware:
    cors:
      origin: https://myapp.com
    helmet:
      enabled: true
    auth:
      enabled: true
    rateLimit:
      enabled: true
      max: 100
```

### Testing Configuration

```yaml
service:
  environment: test
  port: 0 # Random port
  logging:
    silent: true
  middleware:
    auth:
      enabled: false
    rateLimit:
      enabled: false
```