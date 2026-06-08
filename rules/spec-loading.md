---
name: spec-loading
version: 2.0.0
---

# SPEC LOADING BEHAVIOR
Check whether matching specs already exist in: .agents/sk-specs/
Automatically load:
Before generating outputs:
Search existing specs.

Load:

- ba.md
- feature.md
- refactor.md
- fix-bug.md
- review.md
- decisions.md
- risks.md

# PRIORITY

1. Existing Specs
2. Existing Decisions
3. Existing Architecture
4. User Prompt

# CONTINUATION RULE

If specs exist:

Reuse existing decisions.

Avoid conflicting outputs.

Continue current workflow.