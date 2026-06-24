---
name: safe-refactor
description: Safe refactoring workflow — pre/post test execution, regression validation with 10+ test cases.
version: 2.1.0
---

# REQUIRED INPUT

```mermaid
graph TD
    Start([Bắt đầu Refactor]) --> MapDep[1. Phân tích dependencies của target module]
    MapDep --> RunBase[Chạy bộ test suite baseline để đảm bảo code đang xanh]
    RunBase --> DocumentGoals[Ghi nhận vấn đề & mục tiêu vào refactor.md]
    DocumentGoals --> Checkpoint[2. Refactor Plan Approval Checkpoint]
    Checkpoint --> WaitUser{User phê duyệt Kế hoạch Refactor?}
    WaitUser -- Không/Chỉnh sửa --> UpdatePlan[Cập nhật refactor.md] --> Checkpoint
    WaitUser -- Có --> IncrementalCode[3. Sửa code từng bước nhỏ & chạy test liên tục]
    IncrementalCode --> VerifyParity[4. Kiểm tra UI Parity & Zustand State Integrity]
    VerifyParity --> RunAllTests[Chạy full test suite & 10+ validation tests]
    RunAllTests --> End([Hoàn thành Refactor an toàn])
```

- ba.md (Retrieve existing or create via reverse-engineering if legacy code)
- old-test-cases

# WORKFLOW STEPS

## 1. Dependency Analysis & Baseline Check
- Map the target module's import/export dependencies.
- Run all existing test cases (`yarn test`, `npm run test`, `yarn test:jest`, or `vitest`) to verify that the current codebase is green.
- Document current problems, refactor goals, and initial state in `refactor.md` (under `.agents/sk-specs/active/<work-item-name>/` using `templates/refactor.md`).

## 2. Refactor Plan Approval (Blocking)
- Outline the step-by-step refactoring strategy (hook extraction, state isolation, selector usage, component splitting).
- Assess regression risks on adjacent modules.
- Present the plan to the user.
- Ask the user (Design Checkpoint): *"Bạn có muốn chỉnh sửa gì trong kế hoạch tái cấu trúc (refactor) này không?"*
- Stop and wait. Do NOT make code modifications until the user explicitly approves.

## 3. Incremental Implementation
- Modify code in small, isolated steps.
- Commit or save frequently. Rerun tests after each incremental change to prevent regressions.
- Verify UI visual parity (no shifts or layout breaks) and Zustand state hydration/storage integrity.

## 4. Final Validation
- Run the full test suite to ensure no existing tests are broken.
- Execute at least 10 regression validation test cases.
- Record the pre-refactor and post-refactor execution logs inside `refactor.md`.

# VALIDATION

- Minimum: 10 regression validation test cases passing successfully (including old tests + new verification tests).

# OUTPUT

The generated `refactor.md` must contain these exact sections:

- Current Problems
- Refactor Goals
- Refactor Plan
- Regression Risks
- Validation Strategy
- Pre-Refactor Test Execution Log (Confirm all old tests pass)
- Post-Refactor Test Execution Log (Confirm all old & new tests pass)