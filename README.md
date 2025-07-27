# Node Service Framework

A lightweight Node.js framework for building HTTP services with minimal boilerplate. Built on Express 5, it provides server lifecycle management, configuration, authentication, logging, and graceful shutdown out of the box.

## Features

- 🚀 **Express 5** - Battle-tested web framework
- 🔧 **Zero Config** - Sensible defaults with YAML configuration support
- 🔐 **JWT Authentication** - Built-in auth middleware with secure path routing
- 📝 **Structured Logging** - Request tracking with correlation IDs
- 🛡️ **Security** - Helmet, CORS, and security best practices
- ⚡ **Graceful Shutdown** - Proper cleanup and resource management
- 🧪 **Testing Ready** - Jest setup with TypeScript support

## Installation

```bash
npm install @amirossanloo/node-service
```

## Quick Start

```typescript
import { NodeService } from '@amirossanloo/node-service'

async function startServer() {
  // Create service instance
  const { app, setup, logger } = NodeService()

  // Define your routes
  app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' })
  })
  
  app.get('/secure/data', (req, res) => {
    // This route requires authentication
    res.json({ data: 'Secret information' })
  })

  // Setup and run the service
  const { run } = await setup()
  
  // Start with optional cleanup function
  run({
    releaseResources: async () => {
      // Close database connections, etc.
      logger.info('Cleaning up resources')
    }
  })
}

startServer().catch(console.error)
```

## Configuration

Create a `config` directory with YAML files for different environments:

```yaml
# config/node.development.yaml
sns:
  name: my-service
  port: 3000
  auth:
    jwt:
      secret: ${JWT_SECRET}
    securePaths:
      - /secure
      - /api/admin
```

Environment variables can be interpolated using `${VAR_NAME}` syntax.

## Project Structure

This is a monorepo with the following structure:

```
├── packages/
│   ├── node-service/    # Main framework package
│   ├── configuration/   # Config management (planned)
│   └── errors/          # Error handling (planned)
├── examples/            # Usage examples
├── config/              # Sample configurations
└── scripts/             # Utility scripts
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run in development mode
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type:check

# Linting
pnpm lint
```

## Publishing a New Version

1. Make changes to the codebase
2. Update the version number in `package.json`
3. Push changes to the repository
4. Build the project:
   ```bash
   pnpm build
   ```
5. Publish to npm:
   ```bash
   npm publish
   ```

## Architecture

The framework follows a three-layer architecture:

1. **Core Layer**: Essential service functionality
2. **Plugins Layer**: Optional middleware and features
3. **Adapters Layer**: Framework integrations

See [Architecture Documentation](./.claude/docs/node-service.md) for details.

## Contributing

This project uses AI-assisted development with Claude. See [CLAUDE.md](./CLAUDE.md) for guidelines.

## License

MIT