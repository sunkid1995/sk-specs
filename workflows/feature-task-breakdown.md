---
name: feature-task-breakdown
description: Task breakdown workflow — convert roadmap into small, isolated, dependency-aware engineering tasks.
version: 1.0.0
---

# REQUIRED INPUT

- feature.md (or refactor.md/fix-bug.md detailing the roadmap)

# WORKFLOW STEPS

## 1. Roadmap Deconstruction
- Read the approved technical roadmap/plan.
- Breakdown phases into independent, isolated engineering tasks.
- Order tasks to prioritize foundational data/store layers first before building UI components.

## 2. Task Definition & Formatting
- For each task, write down:
  - Title
  - Goal
  - Dependencies (what other tasks must finish first)
  - Priority & Effort Estimation
  - Validation Scope (how to verify it works)

## 3. Checklist Initialization
- Automatically create `progress.md` under `.agents/sk-specs/active/<work-item-name>/` using `templates/progress.md`.
- Populate `progress.md` with the checklist of tasks (marked as `[ ]`).
- Present the tasks checklist to the user for reference.

# OUTPUT

- progress.md (Initialized task list for tracking development progress)

# EACH TASK SHOULD INCLUDE

- title
- goal
- dependencies
- priority
- estimated effort
- validation scope
- optional subtasks