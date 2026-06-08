---
name: performance-optimization
version: 1.0.0
---

# ZUSTAND PERFORMANCE PATTERNS

- **Mandatory Selectors:** Always use selectors when retrieving state from Zustand stores. Never destructure the store directly inside a component.
  
  ## ✅ Correct
  ```ts
  const user = useUserStore((state) => state.user);
  ```
  
  ## ❌ Invalid
  ```ts
  const { user, status } = useUserStore(); // Triggers re-renders on any store update
  ```

# CODE SPLITTING & LAZY LOADING

- **Router Level:** Always use dynamic imports (`React.lazy` or equivalent) for router pages.
- **Heavy Components:** Modals, editors, charting libraries, and heavy third-party modules must be lazy-loaded dynamically when needed rather than bundled in the initial page load.

# DEPENDENCY MANAGEMENT & TREE-SHAKING

- **Prefer ES Modules:** Only use third-party libraries that natively support Tree-shaking.
- **Import Sub-modules:** Import specific modules from libraries rather than the whole library.
  
  ## ✅ Correct
  ```ts
  import { debounce } from 'lodash-es';
  ```
  
  ## ❌ Invalid
  ```ts
  import { debounce } from 'lodash';
  import _ from 'lodash';
  ```

# REACT RENDER OPTIMIZATION

- **Targeted Memoization:** Use `React.memo` for expensive leaf components in long lists.
- **Dependency Caching:** Use `useMemo` and `useCallback` only when passing arrays, objects, or functions to memoized components to prevent unnecessary re-renders. Avoid over-using them on trivial primitive variables.
- **Windowing / Virtualization:** Use list virtualization (e.g., `react-window`) when rendering lists with more than 100 items.

# ASSETS OPTIMIZATION

- **Image Formats:** Prefer WebP, AVIF, or vector SVG formats over PNG/JPG.
- **Lazy Loading Images:** Always use the native `loading="lazy"` attribute on image elements that appear below the fold.
