---
name: regression-safety
version: 1.0.0
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
