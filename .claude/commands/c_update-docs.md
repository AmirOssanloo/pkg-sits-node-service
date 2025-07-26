# Update Documentation Comprehensively

**Documentation Scope:** $ARGUMENTS (optional - defaults to all documentation)

Performs comprehensive documentation updates across the entire Node Service framework, ensuring all code changes are properly documented and all documentation is current and accurate.

## Commands:

1. **Scan for Changes** - Identify documentation gaps:
   - Compare current code with existing documentation
   - Identify new features, API changes, and structural updates
   - Check for outdated examples and references
   - Verify command tables and workflow descriptions

2. **Update Core Documentation**:
   - `README.md` - Project overview, quick start, features
   - `CLAUDE.md` - Tech stack table, commands, workflows
   - Package-specific docs in each package directory
   - API documentation and usage examples

3. **Update Claude Configuration Docs**:
   - `.claude/docs/node-service.md` - Framework architecture
   - `.claude/docs/configuration.md` - Config package details
   - `.claude/docs/errors.md` - Error handling patterns
   - Agent documentation in `.claude/agents/`

4. **Update Changelog**:
   - Add entries for recent changes since last update
   - Follow conventional changelog format
   - Include version numbers and dates
   - Categorize changes (Added, Changed, Fixed, Removed)

5. **Validate Documentation**:
   - Ensure all code examples are functional
   - Verify all links and references work
   - Check formatting and consistency
   - Ensure technical accuracy

6. **Self-Documentation Review**:
   - Extract inline comments and JSDoc
   - Update type definitions and interfaces
   - Ensure exported functions have proper documentation
   - Update package.json descriptions

## Documentation Targets:

**Project Level:**
- README.md with updated features and examples
- CLAUDE.md with current tech stack and commands
- Package workspace documentation

**Package Level:**
- Individual package README files
- EXAMPLE.md files with current usage patterns
- API documentation for exported functions

**Claude Configuration:**
- Architecture documentation
- Agent workflow updates
- Command documentation
- Process and rule updates

**Development:**
- TypeScript type definitions
- JSDoc comments for public APIs
- Inline code documentation
- Testing documentation

## Validation Requirements:

- All code examples must be tested and functional
- All references to file paths must be accurate
- All command tables must reflect actual available commands
- All workflow descriptions must match current processes
- Documentation versioning must be consistent

## Output Standards:

- Follow existing markdown formatting conventions
- Maintain consistent heading structure
- Use proper code syntax highlighting
- Include appropriate badges and metadata
- Ensure mobile-friendly formatting

**Note:** This command focuses exclusively on documentation updates and does not modify any source code.