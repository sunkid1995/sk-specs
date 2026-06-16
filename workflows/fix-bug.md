---
name: fix-bug
description: Bug fix workflow — reproduce bug, identify root cause, fix, and validate with 10+ test cases.
version: 2.1.0
---

# REQUIRED INPUT

- ba.md (Retrieve existing or create via reverse-engineering if legacy code)
- old-test-cases

# WORKFLOW STEPS

## 1. Investigation & Reproduction
- Search the code to locate the module described in the bug report.
- Establish a reproduction path (inputs, environment, user role).
- Write a unit test case that fails deterministically to reproduce the bug behavior.
- Document expected vs actual behaviors.

## 2. Root Cause Analysis (RCA)
- Apply the "5 Whys" method to trace state mutations or logic branches. Find out *why* the bad state occurred rather than patching symptoms.
- Propose a targeted, minimal fix strategy.
- Generate or update `fix-bug.md` under `.agents/sk-specs/active/<work-item-name>/` using `templates/fix-bug.md`.

## 3. Plan Approval Checkpoint (Blocking)
- Present the planned fix, reproduction steps, and regression risks to the user.
- Ask the user (Design Checkpoint): *"Bạn có muốn chỉnh sửa gì trong thiết kế kỹ thuật/kế hoạch sửa lỗi này không?"*
- Stop and wait. Do NOT implement the code fix until the user explicitly approves.

## 4. Implementation & Regression Safety
- Apply the approved code fix.
- Run the reproduction test case to confirm it now passes (turns green).
- Execute at least 10 validation test cases (including old tests + new edge cases) to guarantee 0 regression.
- Record the execution logs inside `fix-bug.md`.

# VALIDATION

- Minimum: 1 reproduction test case demonstrating the failure.
- Minimum: 10 validation test cases passing successfully (including reproduction test case + old test cases).

# OUTPUT

The generated `fix-bug.md` must contain these exact sections:

- Expected Behavior
- Actual Behavior
- Root Cause
- Fix Strategy
- Regression Risks
- Validation Plan
- Reproduction Test Case Execution Log
- All Tests Verification Log