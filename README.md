# AI Agent Workflow Structure

```txt
.agents/
├── rules/
│   ├── architecture-rules.md
│   ├── core-rules.md
│   ├── folder-structure-and-export-rules.md
│   ├── import-rule.md
│   ├── output-format.md
│   ├── security-rules.md
│   ├── spec-loading.md
│   ├── spec-persistence.md
│   └── testing-rules.md
│
├── skills/
│   ├── business-analysis.md
│   ├── code-review-principles.md
│   ├── debugging-patterns.md
│   ├── feature-analysis-skill.md
│   ├── frontend-stack.md
│   ├── performance-optimization.md
│   ├── react-zustand-patterns.md
│   ├── refactor-principles.md
│   ├── regression-safety.md
│   └── vietnamese_assistant.md
│
├── workflows/
│   ├── business-analysis.md
│   ├── code-review.md
│   ├── feature-analysis.md
│   ├── feature-architecture.md
│   ├── feature-task-breakdown.md
│   ├── fix-bug.md
│   ├── legacy-cleanup.md
│   ├── root-cause-analysis.md
│   ├── safe-refactor.md
│   └── testing-workflow.md
│
└── sk-specs/
    ├── active/
    ├── completed/
    ├── archived/
    └── templates/
```

> [!NOTE]
> Trong repository này (`sk-specs`), các thư mục `rules/`, `skills/`, và `workflows/` được đặt trực tiếp ở thư mục gốc để quản lý và phát triển độc lập.
> Khi tích hợp vào dự án Client (Workspace), các thư mục này sẽ được đặt bên trong thư mục con `.agents/` (ví dụ: `.agents/rules/`, `.agents/skills/`, `.agents/workflows/`).

# PURPOSE OF EACH LAYER

## rules/

Global engineering constraints and output behavior.

Responsible for:

- architecture consistency
- response consistency
- implementation restrictions
- engineering priorities
- import organization rules
- scalability constraints
- persistence architecture consistency
- automatic spec persistence
- automatic spec loading
- multi-agent context continuity
- deterministic engineering outputs

---

## skills/

Reusable domain knowledge.

Responsible for:

- tech stack context
- framework patterns
- state management patterns
- feature analysis behavior
- debugging strategies
- root cause investigation
- regression prevention
- safe refactor principles
- Zustand persistence patterns

---

## workflows/

Execution workflows.

Responsible for:

- feature analysis
- architecture planning
- implementation task breakdown
- execution sequencing
- bug reproduction analysis
- root cause analysis
- safe bug fixing
- safe refactor planning
- legacy cleanup strategy
- regression validation

---

## .agents/sk-specs/

Persistent engineering context shared across agents.

Responsible for:

- feature specifications
- architecture decisions
- task breakdown persistence
- technical risk tracking
- implementation progress tracking
- multi-agent collaboration
- context continuity
- historical engineering decisions

# SPEC PERSISTENCE WORKFLOW

All outputs generated from:

- Feature
- Bug
- Refactor

should automatically persist into:

```txt
.agents/sk-specs/<feature-name>/
```

without requiring explicit user instructions.

---

# DEFAULT GENERATED SPEC FILES

## Feature Workflow

```txt
.agents/sk-specs/<feature-name>/
├── ba.md
├── feature.md
├── review.md
├── decisions.md
├── risks.md
└── progress.md
```

---

## Bugfix Workflow

```txt
.agents/sk-specs/<bug-name>/
├── ba.md
├── fix-bug.md
├── review.md
├── decisions.md
├── risks.md
└── progress.md
```

---

## Refactor Workflow

```txt
.agents/sk-specs/<refactor-name>/
├── ba.md
├── refactor.md
├── review.md
├── decisions.md
├── risks.md
└── progress.md
```

# SPEC LOADING BEHAVIOR

Before generating new outputs:

1. Automatically search existing specs in:
   `.agents/sk-specs/`

2. Automatically load:
   - feature analysis
   - architecture decisions
   - implementation plans
   - technical risks
   - progress tracking

3. Reuse existing decisions whenever possible.

4. Avoid generating conflicting architecture or duplicated plans.

# EXPECTED PROMPT SIZE REDUCTION

Before setup:

```md
Feature:
...

Requirements:
...

Tech stack:
...

Generate:
...
```

Before setup for bugfix:

```md
Bug:
...

Expected:
...

Actual:
...
```

Before setup for refactor:

```md
Refactor:
...
```

After setup:

```md
Feature:
Persist current todo tab
```

Or:

```md
Analyze feature:
Persist current todo tab
```

Or:

```md
Create architecture for:
Persist current todo tab
```

Or:

```md
Bug:
Todo tab resets after refresh
```

Or:

```md
Refactor:
Todo page state management
```

Or simply:

```md
Continue:
Persist current todo tab
```

The agent will automatically:

- load previous specs
- continue existing workflow
- preserve architectural decisions
- maintain execution continuity

# RECOMMENDED FUTURE FILES

Additional recommended skills:

```txt
.agents/skills/
├── api-design.md
├── react-query-patterns.md
├── testing-rules.md
├── ui-accessibility.md
├── folder-structure.md
├── performance-optimization.md
├── async-state-patterns.md
└── persistence-migration.md
```

Additional recommended workflows:

```txt
.agents/workflows/
├── migration-workflow.md
├── optimization-workflow.md
├── release-checklist.md
├── performance-audit.md
├── state-migration.md
├── dependency-cleanup.md
└── testing-workflow.md
```

# MULTI AGENT ENGINEERING BENEFITS

- smaller prompts
- deterministic outputs
- reusable engineering workflows
- persistent engineering memory
- lower implementation context size
- safer bugfix workflows
- safer refactor workflows
- reduced regression risk
- improved multi-agent collaboration
- architecture continuity
- shared implementation context
- reduced AI hallucination
- better long-running feature support
- scalable AI engineering pipeline
- historical engineering traceability

# LONG TERM ARCHITECTURE VISION

```txt
Idea
 → Feature Spec
 → Architecture
 → Task Breakdown
 → Implementation
 → QA
 → Release
 → Archive
```

All stages share the same persistent engineering context through:

```txt
.agents/sk-specs/
```
