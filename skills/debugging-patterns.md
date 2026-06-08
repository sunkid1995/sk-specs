---
name: debugging-patterns
version: 1.0.0
---

# DEBUGGING PRINCIPLES

Always identify:

- reproduction conditions
- state transitions
- async timing issues
- stale closure risks
- invalid assumptions
- persistence mismatches
- synchronization issues

# DEBUGGING PRIORITIES

Priority order:

1. Root cause
2. Reproducibility
3. Safe fix scope
4. Regression prevention
5. Performance impact

# COMMON FRONTEND BUG SOURCES

- stale React state
- async race conditions
- Zustand persistence mismatch
- invalid memoization
- incorrect effect dependencies
- hydration timing
- storage desynchronization
- derived state inconsistency

# BUGFIX RULES

- Never patch blindly
- Never fix symptoms only
- Prefer deterministic fixes
- Prefer isolated fixes
- Minimize code changes
