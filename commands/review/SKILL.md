---
name: review
description: Trigger Code Review workflow — scan diffs, cross-reference BA, and generate review.md.
version: 1.0.0
---

# Code Review Command

When this skill is activated (via `/review`), execute the Code Review Workflow:

1. Analyze all recent changes and code diffs in the workspace.
2. Cross-reference changes with business criteria in `ba.md` and check list of acceptance test cases.
3. Automatically generate or update the `review.md` file under `.agents/sk-specs/active/<work-item-name>/` using the structure in `.agents/sk-specs/templates/review.md`.
4. Validate compliance with coding conventions, architecture, imports, and security boundaries.
5. Present the code review feedback, check items, and recommendations to the user.
