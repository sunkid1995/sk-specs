---
name: regression-safety
description: Enforce regression validation rules — verify UI parity, persisted state integrity, async behavior, and edge cases before merging changes.
---

# REGRESSION SAFETY RULES

Always validate:

- UI behavior parity
- persisted state integrity
- async behavior consistency
- loading states
- error states
- edge cases
- navigation behavior

# HIGH RISK AREAS

- persisted state
- Zustand hydration
- async synchronization
- derived state
- memoization
- shared hooks
- reusable components

# SAFETY PRINCIPLES

- prefer small changes
- prefer isolated changes
- avoid broad side effects
- validate assumptions explicitly
