# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Node Service** framework, a Node.js library for creating services with minimal effort. The library provides server lifecycle management, built-in authentication, logging, metrics collection, health checks, Express integration, etc.

**Tech Stack:**
| Category | Tech choice |
|---------|---------|
| Package manager | pnpm |
| Runtime environment | Node.js 22.16.0+ |
| Module system | ESM (ECMAScript modules) |
| TypeScript config | @tsconfig/node22 (uses `moduleResolution: node16`) |
| Web server | Express 5 |
| Middleware | Express-compatible (cookie-parser, cors, helmet) |
| Authentication | JWT (jsonwebtoken) |
| Schema validation | Zod |
| Configuration | YAML files with environment overrides |
| Testing | Jest, ts-jest |
| Build | TypeScript with dual ESM/CJS output |

## Key Commands

| Command             | Purpose                               |
| ------------------- | ------------------------------------- |
| `pnpm install`      | Install dependencies                  |
| `pnpm test`         | Run all tests                         |
| `pnpm lint`         | Run ESLint                            |
| `pnpm type:check`   | Run TypeScript type checking          |
| `pnpm dev`          | Start development server with nodemon |
| `pnpm build`        | Build for production                  |
| `pnpm build:clean`  | Remove build artifacts                |
| `pnpm create:token` | Generate JWT authentication token     |

**Package Manager**: Always use `pnpm` (never npm or yarn)

## Library Architecture

- **Core**: Essential service functionality (createNodeService, createApp, bootApp)
- **Plugins**: Optional middleware (auth, cors, logging, error handling)
- **Adapters**: Framework integrations (Fastify plugins, Express middleware compatibility)
- **Configuration**: YAML-based config with environment variable support
- **Testing**: Jest with TypeScript support
- **Architecture**: Three-layer design (core → plugins → adapters)

## Development Workflow

1. **Plan** → Create plan in `.claude/plans/`
2. **Approve** → Get user approval
3. **Implement** → Follow three-layer architecture
4. **Review** → Validate code quality
5. **Test** → Ensure all tests pass
6. **Commit** → Use conventional commits

## Project Structure

```
/
├── packages/         # Library packages
│   ├── node-service/ # Main service framework
│   ├── configuration/# Config management (planned)
│   └── errors/       # Error handling (planned)
├── examples/         # Usage examples
│   ├── app.ts        # Example service setup
│   └── handlers/     # Example route handlers
├── config/           # Sample configuration files
├── scripts/          # Utility scripts
├── bin/              # Build and dev scripts
├── fixtures/         # Test fixtures
├── .claude/          # AI assistant config
│   ├── plans/        # Task planning
│   ├── docs/         # Package documentation
│   └── agents/       # Agent configs
├── CLAUDE.md         # This file
├── README.md         # Project docs
└── package.json      # NPM package config
```

## Claude Configuration

For detailed guidelines and agent behavior, see:

- `.claude/CLAUDE.md` - Architecture & detailed rules
- `.claude/docs/node-service.md` - Node service framework documentation
- `.claude/docs/configuration.md` - Configuration package documentation
- `.claude/docs/errors.md` - Error handling documentation
- `.claude/plans/TEMPLATE.md` - Plan template
- Agent-specific configs in `.claude/agents/`

## Development Workflow

1. **Analyse** → Analyse the code
2. **Plan** → Create/update plan in `.claude/plans/PLAN_<branch>.md`
3. **Approve** → Get explicit user approval before implementation
4. **Implement** → Follow three-layer architecture
5. **Review** → Code must pass lint and typecheck
6. **Test** → All tests must pass
7. **Commit** → Use conventional commits

## Important Guidelines

- **Package Manager:** Always use `pnpm` - NEVER use `npm` or `yarn`
- **Security:** Validate all inputs, never hardcode secrets
- **Performance:** Optimize middleware chains, avoid blocking operations
- **Documentation:** Keep docs updated when making changes
- **Dependencies:** New dependencies require justification
- **ESM Modules:** This project uses ESM (ECMAScript modules). All relative imports in TypeScript files MUST include the `.js` extension (e.g., `import foo from './foo.js'`). This is required by Node.js ESM resolution and TypeScript's `node16`/`nodenext` module resolution strategy.
- **Dual Package Build:** Packages are built to support both ESM and CommonJS consumers. The build process creates both `dist/esm/` and `dist/cjs/` outputs, allowing the packages to be used in any Node.js environment.

## AI Assistant Configuration

Detailed guidelines for different aspects are in:

- `.claude/CLAUDE.md` - Global rules & architecture
- `.claude/docs/node-service.md` - Node service framework architecture
- `.claude/docs/configuration.md` - Configuration package details
- `.claude/docs/errors.md` - Error handling patterns
- `.claude/agents/CLAUDE.analyser.md` - Analysing agent
- `.claude/agents/CLAUDE.planner.md` - Planning agent
- `.claude/agents/CLAUDE.programmer.md` - Implementation agent
- `.claude/agents/CLAUDE.reviewer.md` - Review agent
- `.claude/agents/CLAUDE.tester.md` - Testing agent

## Self-Updating Documentation

When making changes that affect:

- **Library API** → Update `.claude/docs/node-service.md` and README.md
- **Package structure** → Update relevant `.claude/docs/*.md`
- **Commands** → Update the commands table in this file
- **Configuration** → Update `.claude/docs/configuration.md`
- **Process/rules** → Update agent files in `.claude/agents/`
