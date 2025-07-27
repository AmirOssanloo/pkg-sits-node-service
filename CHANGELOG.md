# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Post-handler middleware**: 404 route handler and global error handler with development stack traces
- **TypeScript user interface**: `AuthenticatedUser` interface for JWT token payload structure
- **Wildcard path matching**: Enhanced auth path matching with regex support for `/api/*` patterns

### Changed

- **JWT authentication security**: Removed hardcoded secret fallbacks, now requires proper configuration
- **Authentication configuration**: Moved from `service.middleware.auth` to `core.auth.strategies.jwt`
- **Configuration examples**: Updated all documentation to reflect new auth structure
- **Project structure**: Consolidated error handling into node-service package
- **Feature descriptions**: Updated "Zero Config" to "Clean Configuration" for accuracy
- **Development workflow**: Added migration phase guidance - no backward compatibility requirements

### Removed

- **Console.log statements**: Removed debug logging from auth middleware and core app
- **Jest coverage output**: Disabled test coverage collection for both packages
- **Version property**: Removed unnecessary version from service configuration
- **Outdated TODOs**: Cleaned up 20+ TODO comments across codebase

### Security

- **JWT secret validation**: Configuration now validates JWT secret presence at startup
- **Path security**: Improved secure path detection with proper wildcard support

### Documentation

- **Claude instructions**: Added pre-release migration guidance
- **Auth strategy**: Updated all examples to use new `core.auth` structure  
- **Package structure**: Fixed references to moved error handling components
- **Architecture**: Updated library architecture descriptions

### Technical Details

- **Breaking Changes**: Auth configuration structure changed, JWT secrets now required
- **Error Handling**: Enhanced with structured error responses and timestamp logging
- **Path Matching**: Improved regex-based path matching for auth routes

## [1.0.0] - 2025-01-26

### Added

- **Zod Schema Validation**: Complete replacement of Joi with Zod for configuration validation
- **Runtime Schema Validation**: Type-safe configuration validation with clear error messages
- **Dual Validation Modes**: Support for both strict and permissive validation
- **Schema Extension Support**: Export schemas for user extension and customization
- **Comprehensive Test Suite**: 45+ tests covering all validation scenarios
- **Enhanced Error Handling**: Structured error messages with path-specific details

### Changed

- **ESLint Migration**: Upgraded to ESLint v9 with flat config format
- **Configuration Package**: Restructured with validation, schemas, and error handling modules
- **TypeScript Types**: Enhanced type definitions with Zod-inferred types
- **Package Structure**: Organized into logical modules (core, validation, loaders, processors)

### Technical Details

- **Dependencies**: Added Zod v4.0.10, upgraded ESLint ecosystem
- **API Changes**: New validation functions (`validateConfig`, `isValidConfig`, etc.)
- **Breaking Changes**: Configuration validation now throws `ZodError` instead of generic errors
- **Performance**: Improved configuration loading and validation performance

### Documentation

- **Configuration Guide**: Updated with Zod validation examples
- **API Documentation**: Comprehensive API documentation for all exported functions
- **Migration Guide**: Examples for transitioning to new validation system
- **Claude Integration**: Enhanced AI assistant configuration and workflows

## [0.0.0] - 2025-01-24

### Added

- Initial Node Service framework structure
- Basic configuration management with YAML support
- TypeScript setup with dual ESM/CJS build
- Jest testing framework configuration
- Express 5 integration foundation
- JWT authentication framework
- CORS and security middleware setup

### Infrastructure

- pnpm workspace configuration
- Turbo build system setup
- ESLint and Prettier configuration
- Husky git hooks setup
- GitHub Actions CI/CD pipeline

---

## Version History Notes

- **v1.0.0**: Major milestone with Zod validation system and enhanced configuration management
- **v0.0.0**: Initial framework foundation and project structure
