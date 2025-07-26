# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Claude command system with 5 new commands for workflow automation
- Comprehensive documentation update command (`c_update-docs`)
- Feature analysis and exploration commands 
- Automated implementation workflow command
- Final validation and commit command

### Changed
- Updated documentation structure with new command listings

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