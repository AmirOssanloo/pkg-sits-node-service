# Node Service Examples

This directory contains example applications demonstrating various features of the `@sits/node-service` package.

## Examples

### 1. Simple Usage (`simple-usage/`)

A minimal example showing basic service setup and routing.

```bash
cd simple-usage
pnpm dev
```

Features demonstrated:
- Basic service creation
- Adding routes with Express Router
- Direct route addition to the app

### 2. Basic Server (`basic-server/`)

A more structured example with separate handler files.

```bash
cd basic-server
pnpm dev
```

Features demonstrated:
- Modular project structure
- Separate handler files
- Resource cleanup pattern

### 3. Authentication Example (`auth-example/`)

Demonstrates JWT authentication with secure endpoints.

```bash
cd auth-example
pnpm dev
```

Features demonstrated:
- JWT authentication setup
- Public vs secure endpoints
- Role-based access control
- Configuration for auth paths

Test endpoints:
- `POST /api/login` - Get JWT token (username: admin, password: password)
- `GET /api/public` - Public endpoint
- `GET /api/secure/profile` - Requires JWT
- `GET /api/admin/users` - Requires JWT with admin role

### 4. Middleware Example (`middleware-example/`)

Shows various middleware features including validation and error handling.

```bash
cd middleware-example
pnpm dev
```

Features demonstrated:
- Request validation with Zod schemas
- Custom middleware
- Error handling
- API key authentication
- Built-in middleware (CORS, body parsing, correlation ID)

Test endpoints:
- `POST /api/users` - Create user with validation
- `PUT /api/users/:id` - Update user with params validation
- `GET /api/error-test/:type` - Test different error scenarios
- `GET /api/protected` - Requires X-API-Key header

## Running Examples

All examples follow the same pattern:

1. Navigate to the example directory
2. Run `pnpm dev` to start in development mode
3. The service will start on the configured port (3001-3004)

## Configuration

Each example has its own `config/index.yaml` file that demonstrates different configuration options:

- Port configuration
- CORS settings
- Authentication strategies
- Environment-specific overrides

## Common Scripts

All examples support these scripts:

- `pnpm dev` - Start with hot reload (nodemon + ts-node)
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Run built JavaScript
- `pnpm type:check` - Check TypeScript types

## Requirements

- Node.js 22.16.0 or higher
- pnpm package manager
- All examples use ESM modules (.js extensions in imports)