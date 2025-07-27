# Node Service Framework

A lightweight Node.js framework for building HTTP services with minimal boilerplate. Built on Express 5, it provides server lifecycle management, configuration, authentication, logging, and graceful shutdown out of the box.

## Features

- 🚀 **Express 5** - Battle-tested web framework
- 🔧 **Clean Configuration** - YAML-based configuration with sensible structure
- ✅ **Schema Validation** - Runtime configuration validation with Zod and clear error messages
- 🔐 **JWT Authentication** - Built-in auth middleware with secure path routing
- 📝 **Structured Logging** - Request tracking with correlation IDs
- 🛡️ **Security** - Helmet, CORS, and security best practices
- ⚡ **Graceful Shutdown** - Proper cleanup and resource management
- 🧪 **Testing Ready** - Jest setup with TypeScript support
- 📦 **Dual Package** - ESM and CommonJS builds for maximum compatibility

## Installation

```bash
npm install @amirossanloo/node-service
```

## Quick Start

```typescript
import { createNodeService } from '@amirossanloo/node-service'

async function startServer() {
  // Create service instance
  const service = createNodeService()

  // Define your routes
  service.app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' })
  })

  // Setup and run the service
  const { run } = await service.setup()

  run({
    releaseResources: async () => {
      // Close database connections, etc.
      service.logger.info('Cleaning up resources')
    },
  })
}

startServer().catch(console.error)
```

## Using Routers

```typescript
import express from 'express'
import { createNodeService } from '@amirossanloo/node-service'

const service = createNodeService()

// Create a router with your routes
const router = express.Router()
router.get('/users', (req, res) => res.json({ users: [] }))
router.post('/users', (req, res) => res.status(201).json({ user: req.body }))

// Setup with the router
const { run } = await service.setup({
  handlers: router,
})

// You can also add routes directly to the app
service.app.get('/custom', (req, res) => {
  res.json({ message: 'Custom route' })
})

run()
```

## Configuration

Create a `config` directory with YAML files for different environments:

```yaml
# config/default.yaml
service:
  name: my-service
  port: 3000
  environment: development

core:
  auth:
    strategies:
      jwt:
        config:
          secret: ${JWT_SECRET}
    paths:
      - /api/*
      - /admin/*
    ignorePaths:
      - /health
      - /metrics
```

Environment variables can be interpolated using `${VAR_NAME}` syntax.

## Project Structure

This is a monorepo with the following structure:

```
├── packages/
│   ├── node-service/    # Main framework package (includes error classes)
│   └── configuration/   # Config management package
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
