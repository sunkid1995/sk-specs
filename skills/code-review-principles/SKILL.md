---
name: code-review-principles
description: Define code review dimensions, priority order, severity levels, and behavioral rules for consistent and effective reviews. Trigger this skill whenever performing code reviews on files, features, branches, or merge requests.
---

# Code Review Principles

## Overview

Systematic code review that catches real issues, not superficial style nits.

**Core principle:** Review for correctness and maintainability first. Style and nitpicks last. Every finding must be actionable.

## When to Use

- Reviewing a merge request / pull request
- Reviewing a feature branch before merge
- Reviewing specific file changes
- Reviewing code before deployment
- Self-reviewing your own changes

**Don't use for:**
- Quick formatting fixes (use linter)
- Single-line typo corrections

## Review Process

```
WHEN starting a code review:

1. UNDERSTAND: Read the change description and context
2. SCOPE: Identify affected modules and features
3. READ: Read ALL changed files completely — don't skim
4. ANALYZE: Apply review dimensions systematically
5. CLASSIFY: Severity-rate each finding
6. REPORT: Generate structured review output
```

## Review Dimensions

Apply these dimensions in order of priority:

### 1. Correctness (Blocking)
- Logic errors
- Edge cases (null, undefined, empty, boundary)
- Type safety violations
- Async/await correctness
- Error handling (no empty catch, no swallowed errors)
- Race conditions
- Off-by-one errors

### 2. Architecture (Important)
- Follows project conventions (AGENTS.md rules)
- Proper separation of concerns
- No tight coupling introduced
- State management correctness (Zustand patterns)
- Import structure compliance (path aliases, import order)
- Naming conventions (kebab-case files, PascalCase components)
- No deep imports into features

### 3. Maintainability (Important)
- Readability
- Function length (>30 lines → consider splitting)
- Nesting depth (>2 levels → refactor)
- Code duplication
- Unclear naming
- Dead code
- Missing comments for complex logic

### 4. Performance (Conditional)
- Unnecessary re-renders
- Missing cleanup in useEffect
- Memory leaks (event listeners, subscriptions)
- Large bundle impact (lazy load if heavy)
- N+1 API calls

### 5. Security (Blocking)
- XSS vulnerabilities
- Unvalidated user input
- Exposed secrets/credentials
- Unsafe dangerouslySetInnerHTML

### 6. Testing (Important)
- Critical paths covered
- Tests verify behavior, not implementation
- Edge cases tested
- Regression risk identified

### 7. UI/UX (Conditional)
- Theme compliance (light/dark)
- i18n compliance (t('key'), no hardcoded text)
- Responsive layout
- Accessibility basics
- Visual consistency with design system

## Severity Classification

| Severity | Description | Action | Color Code |
|----------|-------------|--------|------------|
| **Critical** | Bugs, security issues, data loss risk | Must fix before merge | 🔴 |
| **Important** | Architecture violations, maintainability issues | Should fix before merge | 🟡 |
| **Minor** | Style, naming, small improvements | Fix if time permits | 🔵 |
| **Positive / Nitpick** | Good implementations or small suggestions | Informational only | 🟢 |

## Output Format

The review report `code-review.md` must strictly follow this structure:

```md
# Code Review: [Change Description]

## 1. Đánh giá tổng thể
- **Tóm tắt thay đổi**: [Brief summary of what was reviewed, what and why]
- **Phạm vi ảnh hưởng**: [Affected modules and features]
- **Chất lượng code & Kiến trúc**: [Overall architecture and code quality assessment]
- **Trạng thái đánh giá**: [Approve / Needs Changes / Block with brief reason]

## 2. Đánh giá bổ sung
- [Deeper technical design, scalability, and maintainability analysis]
- [Comparison between new solution and old implementation if applicable]

## 3. Các điểm rủi ro và cần lưu ý
- Rà soát các khía cạnh rủi ro tiềm ẩn (Race conditions, Side-effects, Performance/Memory, Data Integrity).
- Trình bày dạng bảng đánh giá mức độ rủi ro:
  | Rủi ro | Mức độ (Cao/Trung bình/Thấp) | Cần khắc phục ngay? (Có/Không) | Giải pháp giảm thiểu (Mitigation) |
  |---|---|---|---|

## 4. Đánh giá chi tiết mã nguồn
- **🔴 Critical**: [File:Line] — [Issue description]
  - Why: [Explanation]
  - Fix: [Suggested fix]
- **🟡 Important**: [File:Line] — [Issue description]
  - Why: [Explanation]
  - Fix: [Suggested fix]
- **🔵 Minor**: [File:Line] — [Issue description]
  - Fix: [Suggested fix]
- **🟢 Positive**: [File:Line] — [Observation of good pattern/clean code]
```

## Project-Specific Checklist

For this project (FPT Chat / CVX), always verify:

- [ ] No `any` usage (use `unknown` and narrow)
- [ ] Path aliases used (`@store`, `@components`, etc.)
- [ ] No deep feature imports
- [ ] UI text uses `t('key')` — no hardcoded literals
- [ ] `cn()` for className merging
- [ ] Zustand follows `devtools(immer(...))` pattern
- [ ] Server data uses TanStack Query, not Zustand
- [ ] Components use default export
- [ ] Files are kebab-case
- [ ] Hooks are `use-xxx.ts` exporting `useXxx`
- [ ] Separate `.scss` or `.module.scss` for styles
- [ ] No `console.*` in production paths
- [ ] Error handling uses `toast` — never `alert()`

## Common Mistakes in Code Review

| Mistake | Fix |
|---------|-----|
| Reviewing only the diff, not the context | Read surrounding code to understand impact |
| Focusing on style over correctness | Prioritize bugs and logic errors |
| Vague feedback ("make this better") | Be specific with file, line, and suggestion |
| Blocking on nitpicks | Classify severity properly |
| Missing edge cases | Trace data flow with null/empty/boundary values |
| Ignoring test coverage | Check if critical paths are tested |
| Not checking import structure | Verify path aliases and import order |

## Red Flags — STOP and Investigate

- Large files with many responsibilities
- Deep nesting (>3 levels)
- Mixed concerns in single component
- Direct localStorage/sessionStorage access (use wrapper)
- Hardcoded colors or magic numbers
- Missing error boundaries
- Uncontrolled re-renders in lists

## Integration with Spec Persistence

When reviewing code for a tracked feature/sk-refactor/sk-bugfix:

- Reference existing specs in `sk-specs/`
- Verify implementation matches architecture spec
- Update regression checklist if new risks identified

## The Bottom Line

**Review for what matters:** correctness, architecture, maintainability.

Be specific. Be actionable. Classify severity honestly.

Don't block on nitpicks. Don't approve with critical issues.