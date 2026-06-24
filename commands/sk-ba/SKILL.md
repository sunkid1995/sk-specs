---
name: sk-ba
description: Trigger Business Analysis workflow — generate ba.md and stop at BA Checkpoint.
version: 1.0.0
---

# Business Analysis Command

When this skill is activated (via `/sk-ba`), execute the Business Analysis Workflow:

1. Identify the work item name from the context or prompt.
2. Ensure the directory `.agents/sk-specs/active/<work-item-name>/` exists.
3. Automatically generate or update the `ba.md` file using the format specified in `templates/ba.md`.
4. Once generated, present the content to the user and ask (BA Checkpoint):
   *"Bạn có muốn thay đổi hay bổ sung gì cho tài liệu Phân tích Nghiệp vụ (BA) này không?"*
5. Stop and wait for user confirmation before proceeding to any design phase.
