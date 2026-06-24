---
name: sk-continue
description: Resume interrupted work — load current specs and continue next pending task.
version: 1.0.0
---

# Resume Interrupted Progress Command

When this skill is activated (via `/sk-continue`), execute the Context Resume Workflow:

1. Scan the directories under `.agents/sk-specs/active/` to locate the current active task context.
2. Load and read existing specifications (`ba.md`, `feature.md` or `fix-bug.md` / `refactor.md`).
3. Read the current checklist state in `progress.md` to identify completed, in-progress, and pending tasks.
4. Present a quick summary of the current work status to the user and ask for instructions or resume execution on the next pending sub-task.
