---
name: safe-refactor
version: 2.1.0
---

# REQUIRED INPUT

ba.md (Retrieve existing or create via reverse-engineering if legacy code)
old-test-cases (Retrieve and execute before starting refactor)

# OUTPUT

Current Problems

Refactor Goals

Refactor Plan

Regression Risks

Validation Strategy

Pre-Refactor Test Execution Log (Confirm all old tests pass)

Post-Refactor Test Execution Log (Confirm all old & new tests pass)

# VALIDATION

Minimum:

- 10 regression validation test cases passing successfully (including old tests + new verification tests).