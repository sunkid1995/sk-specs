---
name: spec-persistence
description: Spec persistence behavior — file structure, workflow rules, test case requirements, and progress tracking.
version: 3.0.0
---

# SPEC PERSISTENCE BEHAVIOR

For every:

- Feature
- Refactor
- Bug

Automatically persist outputs into:

sk-specs/<work-item-name>/

# FILE STRUCTURE

Feature:

- ba.md
- feature.md
- review.md
- decisions.md
- risks.md
- progress.md

Refactor:

- ba.md
- refactor.md
- review.md
- decisions.md
- risks.md
- progress.md

Bug:

- ba.md
- fix-bug.md
- review.md
- decisions.md
- risks.md
- progress.md

# WORKFLOW RULES

Feature:

BA
→ Feature
→ Review

Refactor:

BA
→ Refactor
→ Review

Bug:

BA
→ Fix Bug
→ Review

# REVIEW RULES

Review is mandatory.

Review must validate:

1. Business requirements
2. Acceptance criteria
3. Architecture compliance
4. Code quality

# TEST CASE REQUIREMENTS

Feature:

Must generate:

- minimum 10 test cases

OR

- minimum 5 technical risks

Refactor:

Must generate:

- minimum 10 regression test cases

Bug:

Must generate:

- minimum 10 validation test cases

# SPEC WRITING & PROGRESS RULES

Use deterministic outputs.

Avoid conversational writing.

Preserve:

- decisions
- assumptions
- risks
- acceptance criteria
- execution order

Progress Updates (Mandatory):

- During execution, the Agent **MUST** update `progress.md` immediately upon starting a task/subtask (marking as `[/]`) or completing it (marking as `[x]`).
- The overall item status in `progress.md` must be set to `Completed` once all tasks are done.

Target Directory:

- Always use `sk-specs/active/<work-item-name>/` for active specs. Never use `.agent` (without 's').

# DECISIONS.MD WRITING GUIDELINES

`decisions.md` records **architectural and technical decisions** that have significant impact on the system design.

When to write:

- **Design Phase**: Record decisions about patterns, libraries, module boundaries, state management approach.
- **Code Phase**: Record decisions made during implementation that deviate from or extend the original design.

What to record:

- Choosing a design pattern (e.g., Zustand slice vs monolithic store).
- Selecting a third-party library over alternatives.
- Splitting or merging modules/components.
- Changing API contracts or data flow.

What NOT to record:

- Minor UI styling decisions (font size, padding values).
- Variable naming choices.
- Import ordering adjustments.

# RISKS.MD WRITING GUIDELINES

`risks.md` tracks **technical and business risks** associated with the current work item.

When to write:

- **BA Phase**: Record business risks (unclear requirements, stakeholder dependencies, scope creep).
- **Design Phase**: Record technical risks (performance concerns, breaking changes, complex migrations).
- **Code Phase**: Update risk status as risks are mitigated or new ones emerge during implementation.

Risk status lifecycle:

- `Open` → Risk identified but not yet addressed.
- `Mitigated` → Countermeasures applied, risk reduced to acceptable level.
- `Accepted` → Risk acknowledged, no action taken (with documented justification).
- `Resolved` → Risk no longer applies.
