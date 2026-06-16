---
name: testing-rules
description: Testing constraints — Vitest, RTL, colocated test files, 80% coverage requirement, and testing principles.
version: 1.0.0
---

# CORE TESTING STACK

- **Test Runner:** Vitest
- **UI Testing:** React Testing Library (RTL)
- **Assertion Library:** Vitest matchers

# COVERAGE REQUIREMENTS

- All new or modified business logic (helpers, hooks, stores) must achieve **minimum 80% code coverage** (statements, branches, functions, lines) before creating a Pull Request.
- Critical paths (e.g., payment flows, auth logic, state hydration) require **100% coverage** for business-critical logic.

# TEST FILE STRUCTURE & PLACEMENT

- **Colocated Rule:** Test files must be placed directly inside the directory of the module being tested.
- **Naming Convention:** Use `index.test.ts` (for hooks, stores, utils) or `index.test.tsx` (for React components).

## ✅ Correct

```txt
components/button/
├── index.tsx
├── index.test.tsx
└── types.ts
```

## ❌ Invalid

```txt
tests/components/button.test.tsx
components/button/button.test.tsx
```

# GENERAL TESTING PRINCIPLES

- **Test Behavior, Not Implementation:** Focus on what the component/hook *does* from the user's perspective, not *how* it does it.
- **Mocking External Services:** Always mock API calls (using MSW or vitest mocks) and native browser APIs (e.g., localStorage, matchMedia) to ensure test speed and stability.
- **Zustand Store Testing:** Reset the store state before each test run (`beforeEach`) to prevent test pollution.
