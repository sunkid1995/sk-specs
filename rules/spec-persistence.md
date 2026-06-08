---
name: spec-persistence
version: 3.0.0
---

# SPEC PERSISTENCE BEHAVIOR

For every:

- Feature
- Refactor
- Bug

Automatically persist outputs into:

.agents/sk-specs/<work-item-name>/

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

# SPEC WRITING RULES

Use deterministic outputs.

Avoid conversational writing.

Preserve:

- decisions
- assumptions
- risks
- acceptance criteria
- execution order