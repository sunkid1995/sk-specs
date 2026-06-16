---
name: import-rule
description: Import organization standards — block ordering, comment format, and alphabetical sorting in TypeScript.
version: 1.0.0
---

# IMPORT ORGANIZATION RULES

## IMPORT PRIORITY

Always organize imports in the following order:

1. React core libraries
2. Third-party libraries
3. Shared/common modules
4. Hooks
5. Services
6. Stores
7. Utilities
8. Types
9. Components
10. Relative modules
11. Style imports

---

# IMPORT BLOCK RULES

- Imports must be grouped by responsibility
- Each import group must have a block comment
- Use one blank line between blocks
- Keep imports inside each block sorted alphabetically (A-Z)

---

# IMPORT BLOCK ORDER

Import blocks must follow this exact order:

1. React
2. Third-party libraries
3. Commons/Common
4. Hooks
5. Services
6. Stores
7. Utils
8. Types
9. Components
10. Relative modules
11. Styles

---

# IMPORT BLOCK COMMENT FORMAT

Use this format:

```ts
// react

// third-party

// commons

// hooks

// services

// stores

// utils

// types

// components

// relative

// styles
```

---

# IMPORT SORTING RULES

- All imports must be sorted alphabetically (A-Z)
- Sorting applies within each import block
- Sorting must be deterministic and stable
- Ignore case sensitivity when sorting
- Do not manually randomize import order

---

# IMPORT SORTING PRIORITY

Sort order should follow:

1. Import block priority
2. Alphabetical import path order
3. Alphabetical imported member order

---

# REACT IMPORT PRIORITY

Even with A-Z sorting:

- `react`
- `react-dom`

must always stay at the top.

Example:

```ts
// react
import React from 'react';
import ReactDOM from 'react-dom';

// third-party
import axios from 'axios';
import clsx from 'clsx';
```

---

# THIRD-PARTY LIBRARIES

- Third-party libraries must always be imported before internal modules
- Keep external dependencies grouped together
- Sort external imports alphabetically

Example:

```ts
// third-party
import clsx from 'clsx';
import dayjs from 'dayjs';
import { debounce } from 'lodash-es';
```

---

# COMMON/COMMONS MODULES

For shared reusable modules:

- Prioritize modules from:
  - `common`
  - `commons`

Example:

```ts
// commons
import { AppButton } from '@/commons/components/AppButton';
import { formatCurrency } from '@/commons/utils/formatCurrency';
```

---

# HOOK IMPORT RULE

Any module starting with `use` should be treated as a hook.

Applies regardless of location.

Example:

```ts
// hooks
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/commons/hooks/useDebounce';
import { useModalStore } from '@/stores/useModalStore';
```

---

# IMPORT MEMBER SORTING

Imported members must also be sorted alphabetically.

Example:

```ts
// correct
import { createUser, deleteUser, updateUser } from '@/services/userService';
```

```ts
// incorrect
import { updateUser, createUser, deleteUser } from '@/services/userService';
```

---

# BLOCK-LEVEL SORTING

Each block must maintain independent A-Z sorting.

Example:

```ts
// third-party
import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';

// hooks
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';

// utils
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
```

---

# CSS/SCSS IMPORT RULE

- Style imports must always be placed last
- Applies to:
  - `.css`
  - `.scss`
  - module styles
- Style imports must also be sorted alphabetically

Example:

```ts
// styles
import './Button.scss';
import './Modal.scss';
```

---

# IMPORT CLASSIFICATION RULES

- Any import path containing:
  - `common`
  - `commons`

must belong to:

```ts
// commons
```

---

- Any imported symbol starting with `use`

must belong to:

```ts
// hooks
```

regardless of actual folder location.

Example:

```ts
// hooks
import { useModalStore } from '@/stores/useModalStore';
```

---

- Any `.css` or `.scss` file

must belong to:

```ts
// styles
```

and always stay at the bottom.

---

# IMPORT CONSISTENCY RULES

- Do not mix type imports and value imports unnecessarily
- Prefer:

```ts
import type { User } from '@/types/user';
```

instead of:

```ts
import { type User } from '@/types/user';
```

- Avoid unused imports
- Remove duplicated imports
- Prefer alias imports (`@/`) over long relative paths

Avoid:

```ts
../../../components/Button
```

Prefer:

```ts
@/components/Button
```

---

# FULL IMPORT EXAMPLE

```ts
// react
import React from 'react';
import ReactDOM from 'react-dom';

// third-party
import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';

// components
import { UserCard } from '@/components/UserCard';

// commons
import { AppButton } from '@/commons/components/AppButton';
import { AppCard } from '@/commons/components/AppCard';

// hooks
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';

// services
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';

// stores
import { useAuthStore } from '@/stores/useAuthStore';

// utils
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

// types
import type { AuthUser } from '@/types/auth';
import type { User } from '@/types/user';

// relative
import { validateForm } from './helpers';

// styles
import './AuthPage.scss';
import './Form.scss';
```