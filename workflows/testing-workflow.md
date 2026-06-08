---
name: testing-workflow
version: 1.0.0
---

# REQUIRED INPUT

ba.md

# OUTPUT

Test Scenarios Map

Unit Test Implementation

Integration Test Implementation

Test Execution Log

Coverage Report

# WORKFLOW STEPS

## 1. Test Scenario Identification
- Analyze the acceptance criteria in `ba.md`.
- Map out Happy Paths, Edge Cases (invalid inputs, null values), and Error Paths.

## 2. Test Implementation
- Create colocated test files (`index.test.ts` or `index.test.tsx`).
- Implement unit tests for logic layers (Zustand stores, helper functions).
- Implement integration tests for UI components (simulating user interactions via `@testing-library/user-event`).

## 3. Execution & Debugging
- Run vitest locally using `npm run test` or `npx vitest`.
- Resolve any failed tests without changing business requirements.

## 4. Coverage Validation
- Run coverage tool (e.g., `vitest run --coverage`).
- Verify coverage meets the >= 80% requirement.

# VALIDATION

Minimum:

- 10 unit/integration test cases covering all key requirements.
- Coverage report showing >= 80% coverage for changed files.
