# Implement New Feature with Proper Workflow

**Feature Description:** $ARGUMENTS

Initiates the implementation of a new feature following the strict agent workflow and project conventions. Ensures proper planning, approval, and execution phases.

## Commands:

1. **Validate Feature Scope** - Ensure the feature request:
   - Aligns with Node Service framework objectives
   - Follows the three-layer architecture
   - Has clear acceptance criteria
   - Is technically feasible

2. **Create Implementation Plan** - Generate comprehensive plan at:
   - File: `./claude/plans/PLAN_[YYYY-MM-DD]_[feature-name].md`
   - Follow template from `./claude/plans/TEMPLATE.md`
   - Include technical decisions, risks, and implementation steps

3. **Set Initial Status** - Mark plan as:
   - Status: 🟡 planning
   - Current Agent: Planner
   - Created date with UTC timestamp

4. **Enforce Workflow** - Ensure strict adherence to:
   - **Plan → Approve → Implement → Review → Test → Commit** sequence
   - No implementation without user approval
   - Agent handoffs follow `.claude/agents/AGENT_WORKFLOW.md`
   - All agents follow their specific guidelines

5. **Wait for Approval** - Set status to ⏸️ awaiting approval and STOP
   - Do NOT proceed to implementation
   - User must explicitly approve before status changes to 🛠 implementing
   - Include approval timestamp in plan

## Implementation Requirements:

- Follow existing code conventions and architecture
- Use `pnpm` package manager exclusively
- Maintain TypeScript strict mode
- Include comprehensive tests
- Update relevant documentation
- Follow ESM module requirements (.js extensions)

## Agent Workflow Integration:

**Planner Role:**
- Create detailed technical plan
- Define acceptance criteria
- Identify risks and mitigations
- Set up proper plan file structure

**Implementation Phase (Only after approval):**
- Programmer agent implements following plan
- Reviewer agent validates code quality
- Tester agent runs comprehensive validation
- Final commit only after all checks pass

## Failure Handling:

- If feature scope is unclear, request clarification
- If feature conflicts with architecture, explain limitations
- If feature is too large, suggest breaking into phases
- If dependencies are missing, document requirements

**CRITICAL:** Never proceed to implementation without explicit user approval of the plan.