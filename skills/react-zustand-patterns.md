---
name: react-zustand-patterns
version: 1.0.0
---

# ZUSTAND PATTERNS

## State Design

Separate:

- persistent state
- transient UI state
- derived state

## Persistence Rules

- Storage access should be abstracted
- Persistence keys should be centralized
- State hydration should be predictable
- Invalid persisted values should fallback safely

## Recommended Layers

UI Layer:

- components
- presentation logic

State Layer:

- zustand stores
- selectors
- actions

Persistence Layer:

- storage wrapper
- storage adapters
- migration handlers

Domain Layer:

- feature types
- enums
- constants

# STORE DESIGN RULES

- Keep stores feature-scoped
- Avoid massive global stores
- Use selectors to reduce rerenders
- Keep actions deterministic
