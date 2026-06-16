---
name: legacy-cleanup
description: Legacy code cleanup workflow — dependency mapping, cleanup steps, and regression validation.
version: 1.0.0
---

# REQUIRED INPUT

- ba.md (context of the legacy module)
- Codebase access

# WORKFLOW STEPS

## 1. Target & Dependency Mapping
- Identify the legacy files, folders, or modules targeted for cleanup.
- Perform a thorough search (using grep/ripgrep) to map out all active dependencies and usages of the target module.

## 2. Cleanup Planning & Risk Assessment
- Document the target, dependency map, cleanup execution steps, and regression risks in the active spec directory.
- Design a validation strategy including at least 10 regression test cases for impacted areas.

## 3. Plan Review Checkpoint (Blocking)
- Present the planned cleanup steps and impact assessment to the user.
- Stop and wait for user confirmation. Do NOT delete or edit any files until approved.

## 4. Execution & Verification
- Cleanly delete target files or remove legacy code segments.
- Resolve any broken imports or reference errors.
- Run the full test suite and execute the 10 regression test cases to ensure zero side-effects.

# VALIDATION

- Minimum: 10 regression validation test cases covering impacted adjacent modules.

# OUTPUT

The cleanup specification document must contain these exact sections:

- Legacy Target Identification
- Dependency & Usage Mapping
- Cleanup Execution Steps
- Impacted Areas & Regression Risks
- Validation Strategy
- Clean Code Verification Checklist
