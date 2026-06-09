# AI Agent Workflow Structure

**`sk-specs`** là bộ cấu trúc khung tiêu chuẩn cung cấp các quy tắc kỹ thuật (`rules`), kỹ năng chuyên môn (`skills`), quy trình thực thi (`workflows`) và biểu mẫu (`templates`) chuẩn để thiết lập môi trường hoạt động cho các AI Agent (như Gemini, Claude, Cursor) trên dự án client.

Dự án này giúp nhiều AI Agent có thể cộng tác làm việc cùng nhau một cách nhất quán trên cùng một dự án, kế thừa ngữ cảnh của nhau thông qua cơ chế lưu trữ đặc tả (`spec-persistence`) và tự động hóa đồng bộ quy tắc mà không gây mất tiến độ thực tế.

---
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

# HƯỚNG DẪN CÀI ĐẶT & ĐỒNG BỘ (INSTALLATION & SYNC)

Để tích hợp cấu trúc Multi-Agent này vào dự án client (Workspace), bạn có thể sử dụng một trong hai phương thức sau:

### Cách 1: Sử dụng `npx` (Khuyên dùng khi lấy trực tiếp từ GitHub)
Mở terminal tại thư mục gốc của dự án client và chạy lệnh (chỉ định rõ nhánh thử nghiệm `feat/support-multi-agent` nếu chưa merge vào nhánh chính):
```bash
npx github:sunkid1995/sk-specs#feat/support-multi-agent
```
Lệnh này sẽ tự động tải các quy chuẩn mới nhất của nhánh thử nghiệm, khởi tạo thư mục `.agents/` nếu chưa có và đồng bộ toàn bộ rules, skills, workflows, templates vào dự án của bạn. Khi nhánh này được merge vào nhánh chính (`main`), bạn có thể bỏ phần hash nhánh (`#feat/support-multi-agent`).

### Cách 2: Sử dụng Script Bash cục bộ
Nếu bạn đã sao chép repository này về máy, hãy chạy script từ thư mục của repository này:
```bash
./sync-agents.sh <đường-dẫn-đến-dự-án-client>
```
Ví dụ:
```bash
./sync-agents.sh ../my-client-project
```

> [!IMPORTANT]
> Cả hai phương thức trên đều tự động bảo vệ dữ liệu thực tế: Các thư mục chứa tiến độ công việc thực tế của Agent (`active/`, `completed/`, `archived/`) sẽ **không bao giờ bị ghi đè hoặc xóa bỏ** nếu đã tồn tại ở dự án client.

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
- Bugfix
- Refactor

should automatically persist into:

```txt
.agents/sk-specs/<work-item-name>/
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

#### Feature Workflow Flow

**Step 1: Business Analysis** (Generates `ba.md`)
```md
BA: Persist current todo tab
```

**Step 2: Design & Code** (Generates `feature.md`)
```md
Feature: Persist current todo tab
```

**Step 3: Review Code** (Generates `review.md`)
```md
Review: Persist current todo tab
```

---

#### Bugfix Workflow Flow

**Step 1: Find/Create BA & Reproduce Bug** (Generates `fix-bug.md`)
```md
Bugfix: Todo tab resets after refresh
```

**Step 2: Review Code** (Generates `review.md`)
```md
Review: Todo tab resets after refresh
```

---

#### Refactor Workflow Flow

**Step 1: Find/Create BA & Plan Refactor** (Generates `refactor.md`)
```md
Refactor: Todo page state management
```

**Step 2: Review Code** (Generates `review.md`)
```md
Review: Todo page state management
```

---

#### Continue interrupted work
```md
Continue: Persist current todo tab
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
├── ui-accessibility.md
├── folder-structure.md
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
└── dependency-cleanup.md
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
