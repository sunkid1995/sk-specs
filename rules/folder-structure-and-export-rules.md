---
trigger: always_on
---

---

Name: folder-structure-and-export-rules
Description: Enforce scalable folder-first architecture and default export conventions for components and hooks.

---

# Folder Structure Rules

## Core Principle

Always create a dedicated folder before creating implementation files.

Flat file structures are NOT allowed for components, hooks, stores, or feature modules.

---

# Required Root Folders

The project should organize source code using these top-level folders when applicable:

/components
/stores
/hooks
/core
/lib

---

# Folder-First Rule

Every module must be placed inside its own folder.

## ✅ Correct

components/button/index.tsx
components/button/index.css
components/button/types.ts

hooks/use-auth/index.ts
hooks/use-auth/types.ts

stores/user-store/index.ts
stores/user-store/types.ts

---

## ❌ Invalid

components/button.tsx
components/button.css
components/button.types.ts

hooks/use-auth.ts

stores/user-store.ts

---

# Component Rules

## Structure

Each component must have its own folder.

Example:

components/modal/
├── index.tsx
├── index.scss
├── types.ts
├── constants.ts
├── utils.ts

---

## Export Rules

Components MUST use export default.

### ✅ Correct

function Button() {
return <button>Click</button>;
}

export default Button;

---

### ❌ Invalid

export const Button = () => {
return <button>Click</button>;
};

export function Button() {
return <button>Click</button>;
}

---

# Hook Rules

## Structure

Every hook must be placed inside its own folder.

Example:

hooks/use-auth/
├── index.ts
├── types.ts
├── constants.ts

---

## Export Rules

Hooks MUST use export default.

### ✅ Correct

function useAuth() {
return {};
}

export default useAuth;

---

### ❌ Invalid

export const useAuth = () => {};

export function useAuth() {}

---

# Naming Rules

## Component Folder Naming

Use kebab-case.

### ✅ Correct

components/user-card/
components/app-header/

### ❌ Invalid

components/UserCard/
components/userCard/

---

## Hook Folder Naming

Hooks must start with use-.

### ✅ Correct

hooks/use-auth/
hooks/use-theme/

### ❌ Invalid

hooks/auth/
hooks/theme-hook/

---

# File Naming Rules

## Preferred File Names

index.tsx
index.ts
types.ts
constants.ts
utils.ts
styles.scss
index.scss

Avoid redundant file naming.

### ❌ Invalid

button.types.ts
button.utils.ts
button.styles.ts

---

# Architectural Goals

These rules exist to:

- Improve scalability
- Prevent flat-folder chaos
- Simplify imports
- Make refactoring easier
- Standardize module boundaries
- Improve AI agent consistency
- Support long-term maintainability
