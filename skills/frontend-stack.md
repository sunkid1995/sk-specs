---
name: frontend-stack
version: 1.0.0
---

# DEFAULT TECH STACK

Frontend:

- React
- TypeScript
- Zustand

UI:

- TailwindCSS
- SCSS Modules

Architecture:

- Feature-based structure
- Shared reusable modules
- Typed domain-driven state

# DEFAULT ENGINEERING EXPECTATIONS

- Strong typing
- Reusable abstractions
- Minimal rerenders
- Predictable state flow
- Clear folder boundaries

# COMPONENT RULES

- Components should remain presentation-focused
- Business logic should not live inside UI components
- Persistence logic should not live inside components
- Shared UI should remain feature-agnostic

# FILE ORGANIZATION

Prefer:

```txt
/features
/shared
/stores
/hooks
/types
/utils
```
