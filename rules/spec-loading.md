---
name: spec-loading
description: Spec context loading behavior — search algorithm, matching rules, and reuse existing decisions and specifications.
version: 3.0.0
---

# SPEC LOADING BEHAVIOR

Before generating any output for a Feature, Bugfix, or Refactor task, the Agent MUST search for and load existing specifications to maintain context continuity.

## 1. SEARCH DIRECTORIES (Ordered by Priority)

Search specs in the following order. Stop at the first match:

1. `sk-specs/active/` — Active work items (highest priority).
2. `sk-specs/completed/` — Previously completed work items (for reference and reuse).
3. `sk-specs/archived/` — Historical records (lowest priority, read-only reference).

## 2. MATCHING ALGORITHM

Given a user prompt describing a work item (e.g., "Feature: Persist current todo tab"), the Agent MUST resolve the matching spec directory using the following steps:

1. **Exact match**: Compare the `<work-item-name>` directory name directly.
   - Example: User says "persist-current-todo-tab" → match `sk-specs/active/persist-current-todo-tab/`.
2. **Kebab-case normalization**: Normalize both user input and directory names to `kebab-case` before comparing.
   - Example: User says "Persist Current Todo Tab" → normalize to `persist-current-todo-tab` → match.
3. **Substring match**: If no exact or normalized match, search for directories whose name contains significant keywords from the user prompt.
   - Example: User says "todo tab persistence" → match `persist-current-todo-tab/` via keyword overlap.

## 3. CONFLICT RESOLUTION

If **multiple specs** match the user prompt:

1. List all matching specs with their paths and statuses.
2. Ask the user to select the correct one: _"Tìm thấy nhiều spec khớp với yêu cầu. Vui lòng chọn spec cần sử dụng:"_
3. Do NOT proceed until the user confirms.

If **no specs** match:

- Proceed with creating a new spec directory under `sk-specs/active/<work-item-name>/`.

## 4. FILES TO LOAD

When a matching spec directory is found, automatically load all available files:

- `ba.md` — Business analysis
- `feature.md` / `refactor.md` / `fix-bug.md` — Technical design
- `decisions.md` — Architecture decisions
- `risks.md` — Technical risks
- `progress.md` — Implementation progress
- `review.md` — Code review results

## 5. PRIORITY RULES

When loaded specs conflict with user prompt:

1. Existing architectural decisions (`decisions.md`) take precedence.
2. Existing risk assessments (`risks.md`) must be acknowledged.
3. User prompt may override specific details but NOT architectural patterns already decided.
4. If override is necessary, the Agent MUST document the change in `decisions.md`.

## 6. CONTINUATION RULE

If specs exist:

- Reuse existing decisions.
- Avoid conflicting outputs.
- Continue current workflow from the last recorded progress state.
