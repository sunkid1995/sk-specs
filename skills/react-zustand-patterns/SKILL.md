---
name: react-zustand-patterns
description: State design rules, Zustand store structure, immer + devtools integration, and separation of data layers. Trigger this skill whenever the user requests creating or refactoring a Zustand store, handling persistence/hydration, or designing client/server data flows.
---

# ZUSTAND PATTERNS

## State Design

Separate:

- persistent state
- transient UI state (local component state via `useState`/`useRef`, keep Zustand for shared state only)
- derived state (compute derived values through selectors, do not store derived state directly)

## Persistence Rules

- Storage access should be abstracted through wrappers (no direct localStorage access in components)
- Persistence keys should be centralized
- State hydration should be predictable
- Invalid persisted values should fallback safely

## Recommended Layers

UI Layer:

- components
- presentation logic

State Layer:

- Zustand stores using the pattern: `useXStore = create<XState>()(devtools(subscribeWithSelector(immer((set, get) => ({...})))))`
- Action labels must follow the format: `'storeName/actionName'` (e.g. `'authStore/login'`)
- selectors and actions

Persistence Layer:

- storage wrapper
- storage adapters
- migration handlers

Domain Layer:

- feature types
- enums
- constants
- Place complex domain stores in `src/app/store/<domain>/` with `xxx.store.ts` + `xxx.types.ts`. Simple stores are a single `xxx.store.ts` at `src/app/store/`.

## Server State Boundary
- Use TanStack Query for server data.
- Do NOT mirror server state into Zustand stores.

# STORE DESIGN RULES

- Keep stores feature-scoped (avoid massive global stores)
- Use selectors to select slice state and reduce unnecessary rerenders
- Keep actions deterministic
