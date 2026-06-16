---
name: output-format
description: Output structure definitions for Feature Analysis, Architecture Design, and Task Breakdown.
version: 1.0.0
---

# FEATURE ANALYSIS OUTPUT

When analyzing a feature, ALWAYS generate:

## Feature Summary

- short overview
- business goal
- affected modules

## Requirements Analysis

- functional requirements
- technical requirements
- persistence requirements
- UI behavior requirements

## Implementation Phases

- phase-by-phase rollout
- dependency-aware ordering
- isolated deliverables

## Reusable Modules

- shared hooks
- storage utilities
- reusable state modules
- shared UI abstractions

## Technical Risks

- edge cases
- synchronization risks
- stale state risks
- persistence risks
- migration risks

## Execution Order

- exact implementation order
- dependency chain
- validation checkpoints

## Validation Strategy

- unit validation
- integration validation
- persistence validation
- regression validation

# TASK BREAKDOWN OUTPUT

When generating implementation tasks:

- tasks must be small
- tasks must be independent
- tasks must minimize context size
- tasks must include dependencies
- tasks must include estimated effort
- tasks must include priority

# ARCHITECTURE OUTPUT

When generating architecture design:

Always include:

- folder structure
- state management strategy
- reusable modules
- type definitions
- separation boundaries
- persistence flow
- scalability considerations