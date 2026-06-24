---
description: Testing workflow — test scenario identification, implementation, execution, and coverage validation.
---

# REQUIRED INPUT

- ba.md
- Modified files or code segments

# WORKFLOW STEPS

## 1. Test Scenario Identification

- Analyze the acceptance criteria in `ba.md`.
- Map out Happy Paths, Edge Cases (invalid inputs, null values, empty values), and Error Paths.

## 2. Test Implementation

- Create colocated test files (`index.test.ts` or `index.test.tsx`).
- Implement unit tests for logic layers (Zustand stores, helper functions).
- Implement integration tests for UI components (simulating user interactions via `@testing-library/user-event`).

## 3. Execution & Debugging

- Run Vitest locally using `npm run test` or `npx vitest`.
- Resolve any failed tests without changing the business requirements.

## 4. Coverage Validation

- Run coverage tool (e.g., `vitest run --coverage`).
- Verify coverage meets the >= 80% requirement for changed files.

# VALIDATION

- Minimum: 10 unit/integration test cases covering all key requirements.
- Coverage report showing >= 80% coverage for changed files.

# OUTPUT

The generated testing documentation must contain these exact sections:

- Test Scenarios Map
- Unit Test Implementation
- Integration Test Implementation
- Test Execution Log
- Coverage Report
