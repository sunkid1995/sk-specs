---
name: sk-feature
description: Trigger Feature Development workflow — verify BA, generate feature.md, and stop at Design Checkpoint.
version: 1.0.0
---

# Feature Development Command

When this skill is activated (via `/sk-feature`), execute the Feature Development Workflow:

1. Verify if `ba.md` exists and is approved under `sk-specs/active/<work-item-name>/`.
   - If `ba.md` does not exist, fall back to executing the `/sk-ba` workflow first.
2. Automatically generate or update the `feature.md` file in `sk-specs/active/<work-item-name>/` using the format specified in `sk-specs/templates/sk-feature.md`.
3. Outline the folder structure, state management strategy, type definitions, and implementation phases.
4. Present the design to the user and ask (Design Checkpoint):
   *"Bạn có muốn chỉnh sửa gì trong thiết kế kỹ thuật/kế hoạch triển khai này không?"*
5. Do not write or modify any application code until the user explicitly approves the design/plan.
