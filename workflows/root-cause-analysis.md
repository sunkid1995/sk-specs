---
name: root-cause-analysis
description: Root cause analysis workflow — 5 Whys, short/long-term solutions, and preventive measures.
version: 1.0.0
---

# REQUIRED INPUT

- ba.md (context of the affected module)
- Bug symptom report

# WORKFLOW STEPS

## 1. Symptom & Impact Description
- Document the exact bug symptoms, environment factors, and logs.
- Analyze the technical and business impact (severity, number of affected users/modules).

## 2. Systematic Investigation
- Run targeted investigation commands (log scans, local environment debugging).
- Document each step taken to isolate variables.

## 3. The 5 Whys Analysis
- Execute a systematic "5 Whys" analysis to drill down from the surface symptom to the deep logical/architectural fault.

## 4. Solutions & Prevention Planning
- Formulate a two-layer solution:
  - Short-term fix/mitigation (to unblock immediately if critical).
  - Long-term fix (to resolve root cause cleanly).
- Propose concrete preventative measures (e.g., adding linter rules, test cases, or guards).
- Draft a validation plan containing at least 5 test cases.

# VALIDATION

- Minimum: 5 validation test cases covering edge cases discovered during investigation.

# OUTPUT

The root cause analysis document must contain these exact sections:

- Symptom Description
- Impact Analysis
- Investigation Steps & Commands
- Root Cause (5 Whys Analysis)
- Proposed Solutions (Short-term & Long-term)
- Preventative Measures
