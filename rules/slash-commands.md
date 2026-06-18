---
name: slash-commands
description: Slash command system definition (/sk-ba, /sk-feature, /sk-bugfix, /sk-refactor, /sk-review, /sk-continue, /sync).
version: 1.0.0
---

# SLASH COMMANDS SYSTEM

When the user enters a prompt starting with a slash (`/`), the Agent MUST immediately identify the corresponding command and trigger the associated workflow, bypassing any default conversation or generic steps.

## SUPPORTED COMMANDS

### 1. `/sk-ba [description]`
- **Goal**: Initialize or update the Business Analysis phase.
- **Action**:
  - Automatically create or update `ba.md` under `sk-specs/active/<work-item-name>/`.
  - Analyze the provided `[description]` or requirements.
  - Output the generated `ba.md` content and stop at the **BA Checkpoint**: *"Bạn có muốn thay đổi hay bổ sung gì cho tài liệu Phân tích Nghiệp vụ (BA) này không?"*.

### 2. `/sk-feature [description]`
- **Goal**: Initialize the Feature Development workflow.
- **Action**:
  - Verify if `ba.md` exists and is approved. If not, fall back to executing `/sk-ba` first.
  - Create or update `feature.md` under `sk-specs/active/<work-item-name>/`.
  - Outline design, architecture decisions, and implementation plan.
  - Output `feature.md` content and stop at the **Design Checkpoint**: *"Bạn có muốn chỉnh sửa gì trong thiết kế kỹ thuật/kế hoạch triển khai này không?"*.

### 3. `/sk-bugfix [description]`
- **Goal**: Initialize the Bug Fix workflow.
- **Action**:
  - Automatically create or update `fix-bug.md` under `sk-specs/active/<work-item-name>/`.
  - Analyze the bug description, list reproduction steps, and propose the fix.
  - Output `fix-bug.md` content and stop at the **Design Checkpoint** (Plan Fix approval).

### 4. `/sk-refactor [description]`
- **Goal**: Initialize the Safe Refactoring workflow.
- **Action**:
  - Automatically create or update `refactor.md` under `sk-specs/active/<work-item-name>/`.
  - Assess dependency risks and plan the refactoring steps.
  - Output `refactor.md` content and stop at the **Design Checkpoint** (Plan Refactor approval).

### 5. `/sk-review`
- **Goal**: Trigger the Code Review phase.
- **Action**:
  - Inspect changed files in the workspace (using diff tools).
  - Automatically generate `review.md` comparing implemented code with requirements in `ba.md`.
  - Present the code review checklist and comments directly.

### 6. `/sk-continue`
- **Goal**: Resume the interrupted work item.
- **Action**:
  - Read existing spec files in `sk-specs/active/` to identify the active work item.
  - Scan the latest state in `progress.md`.
  - Report the current state and automatically resume the next pending task.

### 7. `/sync` or `/update`
- **Goal**: Trigger rule synchronization.
- **Action**:
  - Guide the user or run the sync utility (`sync.js` / `sync-agents.sh`) to synchronize configs from the core repository.

### 8. `/sk-status`
- **Goal**: Display a dashboard of all active work items.
- **Action**:
  - Scan `sk-specs/active/` and `sk-specs/completed/` directories.
  - Summarize each work item: type, current phase, progress percentage, last update time.
  - Output a markdown table. Do NOT create or modify any files.

## EXECUTION RULES

1. **Prefix Matching**: If the prompt starts with a slash `/`, parse the command immediately.
2. **Workflow Priority**: The workflow corresponding to the slash command takes priority over any default agent behavior.
3. **No Placeholders**: Maintain high-quality specification outputs as defined in `output-format.md` (located in the same `rules/` directory).
