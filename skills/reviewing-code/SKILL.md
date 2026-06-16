---
name: reviewing-code
description: Self-review rules and checklist for the agent to verify its own changes before completing a task or submitting code.
---

# Reviewing Code

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

| Severity | Description | Action |
|----------|-------------|--------|
| **Critical** | Bugs, security issues, data loss risk | Must fix before merge |
| **Important** | Architecture violations, maintainability issues | Should fix before merge |
| **Minor** | Style, naming, small improvements | Fix if time permits |
| **Nitpick** | Personal preference, optional improvements | Informational only |

## Output Format

```md
# Code Review: [Change Description]

## Summary
- [Brief summary of what was reviewed]
- [Overall assessment: Block / Needs Changes / Approve]

## Findings

### Critical
- **[File:Line]** — [Issue description]
  - Why: [Explanation]
  - Fix: [Suggested fix]

### Important
- **[File:Line]** — [Issue description]
  - Why: [Explanation]
  - Fix: [Suggested fix]

### Minor
- **[File:Line]** — [Issue description]
  - Fix: [Suggested fix]

### Nitpick
- **[File:Line]** — [Observation]

## Positive Notes
- [What was done well]

## Overall Assessment
- [Final recommendation with reasoning]
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
