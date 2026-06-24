---
name: sk-bugfix
description: Trigger Bugfix workflow — analyze bug, reproduce, and plan fix strategy.
version: 1.0.0
---

# Bug Fixing Command

When this skill is activated (via `/sk-bugfix`), execute the Bugfix Workflow:

1. Identify or create `ba.md` for the context of the bug. If it's legacy code, perform reverse-engineering to document requirements.
2. Automatically generate or update `fix-bug.md` under `.agents/sk-specs/active/<work-item-name>/` using `templates/fix-bug.md`.
3. List the reproduction steps and establish a failing test case to isolate the bug behavior.
4. Stop at the Design Checkpoint:
   *"Bạn có muốn chỉnh sửa gì trong thiết kế kỹ thuật/kế hoạch sửa lỗi này không?"*
5. After design approval, write the fix, verify it passes the reproduction test, and execute validation using at least 10 validation test cases.
