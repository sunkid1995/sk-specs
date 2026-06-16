---
name: refactor-principles
description: Define safe refactoring principles, restrictions, and preferred patterns to reduce complexity without introducing regressions. Trigger this skill whenever refactoring codebase modules or when requested to make cleanups.
---

# Refactoring Principles & Workflow

## Core Goal
Every refactoring process must aim to reduce complexity, improve modularity and testability, and eliminate duplicate logic. 

## Refactoring Restrictions
- Do NOT rewrite stable, working code without a measurable benefit or performance bottleneck.
- Do NOT introduce architectural changes or new feature requirements during a refactor.
- Do NOT mix refactoring with active bugfixes or feature implementations.

## Safe Refactoring Workflow

### Phase 1: Establish Baseline
- Run the test suite (`yarn test:jest` or `yarn validate`) to verify that the code is green before starting.
- Note existing UI layout or take snapshots to verify visual parity later.

### Phase 2: Apply Incremental Changes
- Keep edits small, isolated, and commit frequently.
- Prefer these safe, project-specific refactor patterns:
  - **Hook Extraction**: Move complex logic, side-effects, and API states into custom hooks.
  - **State Isolation**: Keep transient UI state local using `useState` or `useRef` rather than polluting Zustand.
  - **Selector Extraction**: Use selectors when subscribing to Zustand stores to minimize unnecessary renders.
  - **Component Splitting**: Break down large components (>30 lines of JSX) into smaller, focused sub-components.

### Phase 3: Verify & Parity Check
- Verify **UI Parity**: Ensure there are no visual regressions, shifts, or layout breaks.
- Verify **State Integrity**: Check that persisted values, hydration lifecycles, and storage schemas operate correctly.
- Rerun tests to ensure everything remains green.
