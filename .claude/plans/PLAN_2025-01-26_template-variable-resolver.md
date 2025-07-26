# Plan: Template Variable Resolver for Configuration Package

## Meta

- **Branch/Ticket**: feature/template-variable-resolver
- **Created**: 2025-01-26 13:30 UTC
- **Status**: 🟡 planning
- **Current Agent**: Planner
- **Approved By**: Pending user approval

## Goals

Acceptance criteria for this task:

- [ ] Add file-level resolver configuration via `core.resolver` property
- [ ] Support `${VARIABLE}` template syntax without prefixes in YAML files
- [ ] Implement ENV resolver for process.env variables (default behavior)
- [ ] Implement AWS_SECRET_MANAGER resolver for AWS Secrets Manager
- [ ] Maintain current file structure (index.yaml + node.{stage}.yaml)
- [ ] Ensure full backward compatibility with existing configurations
- [ ] Provide comprehensive error handling with clear messages
- [ ] Achieve 100% test coverage for both resolvers
- [ ] Update documentation with usage examples

## Implementation Steps

Detailed breakdown of work:

- [ ] **Step 1**: Create resolver interfaces and base classes → `packages/configuration/src/resolvers/base.ts`
- [ ] **Step 2**: Implement ENV resolver → `packages/configuration/src/resolvers/env.ts`
- [ ] **Step 3**: Implement AWS Secrets Manager resolver → `packages/configuration/src/resolvers/aws-secrets.ts`
- [ ] **Step 4**: Update Zod schemas → `packages/configuration/src/validation/schemas.ts`
- [ ] **Step 5**: Build template processing engine → `packages/configuration/src/template/processor.ts`
- [ ] **Step 6**: Create template parser utilities → `packages/configuration/src/template/parser.ts`
- [ ] **Step 7**: Enhance configuration assembly → `packages/configuration/src/core/assemble.ts`
- [ ] **Step 8**: Add AWS SDK peer dependency → `packages/configuration/package.json`
- [ ] **Step 9**: Update exports and maintain API compatibility → `packages/configuration/src/index.ts`
- [ ] **Step 10**: Write comprehensive tests → `packages/configuration/src/resolvers/*.spec.ts`
- [ ] **Step 11**: Update documentation and examples → `packages/configuration/EXAMPLE.md`

## Technical Decisions

Key architectural choices:

- **Pattern**: File-level resolver selection via `core.resolver` property
- **Template Syntax**: Simple `${VARIABLE_NAME}` without prefixes
- **Resolver Types**: 
  - `ENV`: Default, uses `process.env`
  - `AWS_SECRET_MANAGER`: Uses AWS Secrets Manager API
- **API Changes**: 
  - New `assembleConfigWithTemplates()` function
  - Maintain backward compatibility with existing `assembleConfig()`
  - Enhanced options: `{ awsRegion?: string }`
- **Dependencies**:
  - Add `@aws-sdk/client-secrets-manager` as peer dependency
  - Maintain existing dependencies (zod, js-yaml, ramda)
- **File Structure**:
  - New `resolvers/` directory for resolver implementations
  - New `template/` directory for processing engine
  - Enhance existing `core/assemble.ts`

## Architecture Design

### File Structure Changes
```
packages/configuration/src/
├── resolvers/
│   ├── base.ts           # VariableResolver interface
│   ├── env.ts            # Environment variable resolver
│   ├── aws-secrets.ts    # AWS Secrets Manager resolver
│   ├── env.spec.ts       # ENV resolver tests
│   └── aws-secrets.spec.ts # AWS resolver tests
├── template/
│   ├── processor.ts      # Template processing engine
│   ├── parser.ts         # Template parsing utilities
│   ├── processor.spec.ts # Processing tests
│   └── parser.spec.ts    # Parser tests
└── core/
    └── assemble.ts       # Enhanced with template support
```

### Template Processing Flow
```typescript
1. Load config files (index.yaml + node.{stage}.yaml)
2. Merge configurations with ramda.mergeDeepRight
3. Extract resolver type from merged.core.resolver (default: 'ENV')
4. Create appropriate resolver instance
5. Process all ${VARIABLE} templates recursively
6. Remove resolver property from final config
7. Apply defaults and validate with Zod
```

### Configuration Examples

#### Development Configuration
```yaml
# config/index.yaml
name: ${SERVICE_NAME}
core:
  port: ${PORT}

# config/node.development.yaml
core:
  resolver: ENV  # Default, optional
database:
  url: ${DATABASE_URL}
  password: ${DB_PASSWORD}
```

#### Production Configuration
```yaml
# config/node.production.yaml
core:
  resolver: AWS_SECRET_MANAGER
database:
  url: ${rds-connection-string}
  password: ${rds-password}
external_apis:
  stripe_key: ${stripe-secret-key}
```

## Testing Strategy

- **Unit Tests**: 
  - Each resolver validates correct resolution
  - Each resolver handles errors appropriately
  - Template processor handles various syntax patterns
- **Integration Tests**: 
  - Full configuration assembly with templates
  - Error messages are helpful and actionable
  - Backward compatibility with existing configs
- **Mock Strategy**: 
  - Mock AWS SDK for AWS Secrets Manager tests
  - Mock process.env for environment variable tests
  - Test parallel resolution performance

## Error Handling Examples

```typescript
// Clear, actionable error messages
ConfigValidationError: {
  "message": "Template resolution failed",
  "details": [
    "Environment variable DATABASE_URL is not defined",
    "Failed to resolve AWS secret rds-password: AccessDenied"
  ]
}
```

## Risks & Mitigations

- **Risk**: Breaking existing configurations
  - **Mitigation**: Full backward compatibility, existing API unchanged
- **Risk**: AWS SDK bundle size impact
  - **Mitigation**: Use peer dependency, only loaded when needed
- **Risk**: Performance impact on config loading
  - **Mitigation**: Parallel variable resolution, minimal processing overhead
- **Risk**: Security - secrets in memory/logs
  - **Mitigation**: No caching of resolved secrets, careful error message handling

## Future Considerations (Not in scope)

- Additional resolvers (Azure Key Vault, HashiCorp Vault)
- Variable caching with TTL
- Nested variable resolution `${AWS_SECRET:${SERVICE_NAME}-secret}`
- Conditional templates based on environment

## Agent Handoffs

- [ ] **Planner → User**: Plan ready for approval
- [ ] **User → Programmer**: Plan approved, status set to 🛠 implementing
- [ ] **Programmer → Reviewer**: All steps complete, tests passing
- [ ] **Reviewer → Tester**: Code approved, ready for final validation
- [ ] **Tester → Complete**: All tests pass, status set to ✅ done

## Decisions Log

- **2025-01-26**: Chose file-level resolver over prefix-based approach for cleaner syntax
- **2025-01-26**: Decided to maintain backward compatibility with separate function

---

*Status Legend:*
- 🟡 planning - Initial planning phase
- ⏸️ awaiting approval - Ready for user review
- 🛠 implementing - Active development
- 🔍 reviewing - Code review in progress
- ✅ done - Completed and tested