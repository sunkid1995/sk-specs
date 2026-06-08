---
name: refactor-principles
version: 1.0.0
---

# REFACTOR PRINCIPLES

Good refactor should:

- reduce complexity
- improve maintainability
- improve readability
- improve modularity
- reduce duplication
- improve testability

# REFACTOR RESTRICTIONS

Do NOT:

- rewrite stable code unnecessarily
- introduce architectural changes without reason
- mix refactor with feature implementation
- mix refactor with bugfix unless necessary

# SAFE REFACTOR PATTERNS

Prefer:

- extraction
- composition
- state isolation
- hook extraction
- utility extraction
- selector extraction
- component splitting

Avoid:

- massive rewrites
- cross-feature rewrites
- large state redesigns
