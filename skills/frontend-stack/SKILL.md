---
name: frontend-stack
description: Guide on default tech stack, folder structure, component organization rules, and coding conventions of the project. Trigger this skill whenever the user requests creating or modifying a React component, adding a hook, or changing the frontend folder structure.
---

# DEFAULT TECH STACK

Frontend:

- React 18
- TypeScript (Strict mode, never use `any`)
- Zustand with `immer` + `devtools` + `subscribeWithSelector`
- TanStack Query for server state

UI:

- Tailwind utilities
- `*.module.scss` (SCSS modules)
- `cn()` helper from `@lib/utils` for className merging

Architecture:

- Feature-based structure (`src/app/features`)
- Shared reusable modules/components (`src/app/components/shared`)
- Typed domain-driven state (`src/app/store`)

# DEFAULT ENGINEERING EXPECTATIONS

- Strong typing (no `any`, use `unknown` and type narrowing)
- Reusable abstractions (extracted into hooks, services, or utils)
- Minimal rerenders
- Predictable state flow
- Clear folder boundaries (Folder-First architecture: every component/hook/store must have its own folder)

# COMPONENT & HOOK RULES

- Components should remain presentation-focused
- Business logic and persistence logic should not live inside UI components
- Shared UI should remain feature-agnostic
- Components and Hooks must use `export default`
- Hooks must be placed in a dedicated folder starting with `use-` (e.g. `hooks/use-auth/index.ts`) and export `useAuth`
- Never hardcode UI text. Use `t('key')` from `react-i18next` (Vietnamese is the default locale)

## Detailed React & TypeScript Rules
- Props must have explicit types defined
- Public functions and hooks must have explicit return types declared
- Do not use arbitrary type casting (like `as unknown as X`) unless absolutely necessary and documented
- Structure component contents in this order: Props -> Hooks -> State/Refs -> Handlers/Effects -> JSX
- Keep JSX clean; do not perform complex data processing or computation inside JSX. Extract into variables or helpers
- Prioritize extracting complex logic into custom hooks if component size exceeds 30 lines
- Do not call hooks conditionally or inside loops

## Styling & Tailwind Rules
- Use separate SCSS modules (`*.module.scss`) for complex layouts, animations, or styling logic that is hard to maintain with Tailwind
- Do not write inline class strings that are overly long (>3 lines)
- Use the `cn()` helper from `@lib/utils` to merge class names dynamically
- Do not write pure CSS/SCSS if existing Tailwind utilities can handle the requirements

## Accessibility & Error Handling
- Buttons must use semantic `<button>` tags; do not mock buttons using `<div>` or `<span>` without ARIA and keyboard handling
- Inputs must have associated `<label>` tags or clear `aria-label` descriptors
- Include `aria-*` attributes where appropriate to support screen readers
- Do not assume external data or API responses always exist; use optional chaining (`?.`) and provide fallback values or fallback UI
- Display user-facing errors using `toast` from `react-hot-toast` (never use `alert()`)

# FILE ORGANIZATION

Always import via path aliases: `@components`, `@hooks`, `@store`, `@services`, `@utils`, `@config`, `@contexts`, `@app/types`, `@assets`. No `../../` relative paths.

Prefer folder structure within `src/app/`:

- `components/` (UI components)
- `store/` (Zustand stores)
- `hooks/` (flat list of `use-*.ts` hooks)
- `features/` (isolated feature modules)
- `types/`
- `utils/`

# SELF-REVIEW CHECKLIST
Before writing or submitting frontend code, always verify:
- [ ] Does it violate folder-first architecture?
- [ ] Are any named exports used for components or hooks?
- [ ] Is there any `any` type usage?
- [ ] Are there hardcoded UI text strings instead of `t('key')`?
- [ ] Are all path aliases imported correctly?
- [ ] Are hooks conditionally called?
- [ ] Is JSX clean and semantic?
