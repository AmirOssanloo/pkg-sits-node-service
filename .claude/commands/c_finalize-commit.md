# Finalize, Validate and Commit Changes

**Commit Message:** $ARGUMENTS (optional - will generate conventional commit message if not provided)

Performs final validation of all changes, runs comprehensive checks, and commits code only if all validation passes. If any step fails, hands work back to appropriate agent for fixes.

## Commands:

1. **Pre-Commit Validation** - Run all quality checks:
   - `pnpm install` - Ensure dependencies are current
   - `pnpm lint` - ESLint validation
   - `pnpm type:check` - TypeScript compilation check
   - `pnpm test` - Full test suite
   - `pnpm build` - Production build validation

2. **Validation Gate** - Check results:
   - **IF ANY STEP FAILS**: STOP immediately
   - Log the failure details
   - Identify appropriate agent for fix (Programmer/Reviewer/Tester)
   - Hand back to agent workflow WITHOUT committing
   - Update plan status to reflect needed fixes

3. **Git Status Review** - Only if all checks pass:
   - `git status` - Review staged and unstaged changes
   - `git diff` - Review actual changes being committed
   - Verify no sensitive information (secrets, keys, personal data)
   - Ensure only intended files are included

4. **Commit Creation** - Generate conventional commit:
   - If $ARGUMENTS provided, use as commit message
   - Otherwise, analyze changes and generate appropriate message
   - Follow conventional commit format: `type(scope): description`

5. **Final Commit** - Only after all validation passes:
   - `git add` relevant files
   - `git commit` with proper message
   - Confirm commit succeeded
   - Update plan status to ✅ done if applicable

## Failure Handling:

**Lint Failures:**

- Hand back to Programmer agent
- Update plan: "Code quality issues need resolution"

**Type Check Failures:**

- Hand back to Programmer agent
- Update plan: "TypeScript compilation errors need fixes"

**Test Failures:**

- Hand back to Tester agent
- Update plan: "Test failures need investigation and fixes"

**Build Failures:**

- Hand back to Reviewer agent
- Update plan: "Build configuration issues need resolution"

## Commit Message Examples:

```
feat(configuration): add Zod schema validation
```

```
fix(auth): resolve JWT token validation edge case
```

## Critical Requirements:

- **NEVER commit if any validation step fails**
- **NEVER push to remote unless explicitly requested**
- **ALWAYS use conventional commit format**
- **NEVER commit sensitive information**

**Success Criteria:** All checks green, clean commit created, plan marked complete.
