---
name: architecture-rules
description: Frontend architecture constraints — separation of concerns, modular Zustand stores, storage wrapper, and scalability.
version: 1.0.0
---

# FRONTEND ARCHITECTURE RULES

- Prefer feature-based architecture
- Separate UI, state, persistence, and domain concerns
- Shared modules must remain framework-agnostic when possible
- Keep feature state isolated
- Avoid global state pollution

# STATE MANAGEMENT RULES

- Zustand should be modularized by feature
- Persisted state must be isolated from transient state
- State shape must be typed explicitly
- Avoid direct storage access inside components

# STORAGE RULES

- All storage access should go through a wrapper layer
- Support future migration from localStorage to other persistence layers
- Define storage keys centrally
- Handle invalid persisted values safely

# REUSABILITY RULES

- Shared hooks belong in shared/hooks
- Shared storage utilities belong in shared/storage
- Shared types belong in shared/types
- Avoid duplicate persistence logic

# SCALABILITY RULES

- Design for future multi-tab support
- Design for future user preference persistence
- Design for future server synchronization
- Avoid hardcoded feature assumptions