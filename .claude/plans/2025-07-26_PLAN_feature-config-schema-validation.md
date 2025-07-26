# Plan: Configuration Schema Validation with Zod

## Meta

- **Branch/Ticket**: feature/config-schema-validation
- **Created**: 2025-06-25 16:00 UTC
- **Status**: ✅ done
- **Current Agent**: Reviewer
- **Approved By**: User/2025-06-25 16:15 UTC

## Goals

Acceptance criteria for this task:

- [x] Replace Joi with Zod throughout the codebase
- [x] Implement runtime schema validation for configuration
- [x] Provide clear, actionable error messages for validation failures
- [x] Support both strict and permissive validation modes
- [x] Maintain backward compatibility with existing configs
- [x] Future-proof design for OpenAPI integration

## Implementation Steps

Detailed breakdown of work:

- [x] **Step 1**: Update tech stack documentation → `CLAUDE.md`
- [x] **Step 2**: Add Zod dependency → `packages/configuration/package.json`
- [x] **Step 3**: Create schema definitions → `packages/configuration/src/schemas.ts`
- [x] **Step 4**: Integrate validation into assembleConfig → `packages/configuration/src/assembleConfig.ts`
- [x] **Step 5**: Create validation utilities → `packages/configuration/src/validation.ts`
- [x] **Step 6**: Write comprehensive tests → `packages/configuration/src/schemas.spec.ts`
- [x] **Step 7**: Update configuration documentation → `.claude/docs/configuration.md`
- [x] **Step 8**: Update example configurations → `packages/configuration/EXAMPLE.md`

## Technical Decisions

Key architectural choices:

- **Pattern**: Zod schemas as single source of truth for types and validation
- **Dependencies**:
  - `zod`: ^3.22.4 (latest stable)
  - Remove `joi` if found (currently only in docs)
- **API Changes**:
  - `assembleConfig` will throw `ZodError` on validation failure
  - New `validateConfig` export for standalone validation
  - Schema exports for user extension
- **Validation Modes**:
  - Strict: Rejects unknown properties (for production)
  - Permissive: Allows unknown properties (default, for flexibility)

## Schema Design

```typescript
// Core schemas matching TypeScript interfaces
const StrategyDefinitionSchema = z.object({
  provider: z.string(),
  config: z.record(z.unknown()).optional(),
})

const CoreConfigSchema = z.object({
  auth: AuthConfigSchema.nullable(),
  cloud: CloudConfigSchema,
  port: z.number().int().min(0).max(65535).default(3000),
  cors: CorsConfigSchema,
  https: HttpsConfigSchema,
})

const ConfigSchema = z
  .object({
    name: z.string().min(1),
    core: CoreConfigSchema,
  })
  .passthrough() // Allow custom properties
```

## Testing Strategy

- **Unit Tests**:
  - Each schema validates correct data
  - Each schema rejects invalid data with clear errors
  - Schema composition works correctly
- **Integration Tests**:
  - Full configuration validation in assembleConfig
  - Error messages are helpful and actionable
  - Backward compatibility with existing configs
- **Manual Testing**:
  - Create invalid config and verify error clarity
  - Test with real-world complex configurations

## Error Handling Examples

```typescript
// Clear, actionable error messages
ZodError: {
  "issues": [{
    "path": ["core", "port"],
    "message": "Expected number, received string"
  }, {
    "path": ["core", "cors", "origins", 0],
    "message": "Invalid URL"
  }]
}
```

## Risks & Mitigations

- **Risk**: Breaking existing configurations
  - **Mitigation**: Extensive testing with current configs, permissive mode by default
- **Risk**: Zod bundle size concerns
  - **Mitigation**: Zod is ~8kb gzipped, much smaller than Joi
- **Risk**: Learning curve for Zod syntax
  - **Mitigation**: Comprehensive examples and documentation

## Future Considerations (Not in scope)

- OpenAPI schema generation with zod-to-openapi
- Automatic TypeScript type generation from schemas
- Schema-based CLI validation tools
- Runtime type guards for API endpoints

## Agent Handoffs

- [x] **Planner → User**: Plan ready for approval
- [x] **User → Programmer**: Plan approved, status set to 🛠 implementing
- [x] **Programmer → Reviewer**: All steps complete, tests passing
- [x] **Reviewer → Tester**: Code approved, ready for final validation
- [x] **Tester → Complete**: All tests pass, status set to ✅ done

## Decisions Log

- **2025-06-25**: Chose Zod over Joi for better TypeScript integration and future OpenAPI support
- **2025-06-25**: Implementation complete - All tests written, documentation updated, TypeScript compiles successfully
- **2025-01-26**: Review and testing complete - All validation checks pass, schema works correctly with sample configurations, ready for production use

---

_Status Legend:_

- 🟡 planning - Initial planning phase
- ⏸️ awaiting approval - Ready for user review
- 🛠 implementing - Active development
- 🔍 reviewing - Code review in progress
- ✅ done - Completed and tested
