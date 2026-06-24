---
name: sk-refactor
description: Trigger Safe Refactor workflow — assess dependencies and plan incremental refactoring.
version: 1.0.0
---

# Safe Refactoring Command

When this skill is activated (via `/sk-refactor`), execute the Refactor Workflow:

1. Retrieve or construct `ba.md` and gather existing test coverage for the target module.
2. Automatically generate or update `refactor.md` under `.agents/sk-specs/active/<work-item-name>/` using `templates/refactor.md`.
3. Evaluate architectural impacts, dependency graphs, and plan changes incrementally.
4. Stop at the Design Checkpoint:
   *"Bạn có muốn chỉnh sửa gì trong kế hoạch tái cấu trúc (refactor) này không?"*
5. After approval, perform the refactoring step-by-step and run test suites to ensure 0 regression (minimum 10 regression test cases).
