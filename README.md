# Software Development Workflow with AI Agents

**`sk-specs`** là bộ cấu trúc khung tiêu chuẩn cung cấp các quy tắc kỹ thuật (`rules`), kỹ năng chuyên môn (`skills`), quy trình thực thi (`workflows`) và biểu mẫu (`templates`) chuẩn nhằm tối ưu hóa toàn bộ **quy trình phát triển phần mềm (Software Development Lifecycle - SDLC) – từ khâu phân tích nghiệp vụ, thiết lập kiến trúc, phát triển tính năng, sửa lỗi cho đến khi ship tính năng**.

Dự án tập trung vào việc chuẩn hóa và duy trì ngữ cảnh phát triển cho AI Agent (như Gemini, Claude, Cursor) thông qua cơ chế lưu trữ đặc tả (`spec-persistence`). Nhờ cơ chế chia sẻ và kế thừa ngữ cảnh nhất quán này, hệ thống sẵn sàng hỗ trợ **cộng tác Multi-Agent (Đa Agent)**: cho phép các Agent khác nhau (ví dụ: Agent lập kế hoạch BA, Agent viết Code, Agent thực hiện Code Review) làm việc nối tiếp hoặc song song trên cùng một dự án mà không bị đứt gãy thông tin hay mất tiến độ thực tế.

---

```txt
.agents/
├── skills/ (Các Slash Commands được đồng bộ từ thư mục `commands/`)
│   ├── sk-ba/
│   │   └── SKILL.md
│   ├── sk-bugfix/
│   │   └── SKILL.md
│   ├── sk-continue/
│   │   └── SKILL.md
│   ├── sk-feature/
│   │   └── SKILL.md
│   ├── sk-refactor/
│   │   └── SKILL.md
│   └── sk-review/
│       └── SKILL.md
│
└── sk-specs/
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
    │   ├── business-analysis/
    │   │   └── SKILL.md
    │   ├── code-review-principles/
    │   │   └── SKILL.md
    │   ├── debugging-patterns/
    │   │   └── SKILL.md
    │   ├── feature-analysis/
    │   │   └── SKILL.md
    │   ├── frontend-stack/
    │   │   └── SKILL.md
    │   ├── performance-optimization/
    │   │   └── SKILL.md
    │   ├── react-zustand-patterns/
    │   │   └── SKILL.md
    │   ├── refactor-principles/
    │   │   └── SKILL.md
    │   ├── regression-safety/
    │   │   └── SKILL.md
    │   ├── reviewing-code/
    │   │   └── SKILL.md
    │   └── vietnamese-assistant/
    │       └── SKILL.md
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
    ├── templates/
    │   ├── ba.md
    │   ├── feature.md
    │   ├── progress.md
    │   └── ...
    ├── active/
    ├── completed/
    └── archived/
```

> [!NOTE]
> Trong repository này (`sk-specs`), các thư mục `commands/`, `rules/`, `skills/`, `workflows/` và `templates/` được đặt trực tiếp ở thư mục gốc để quản lý và phát triển độc lập.
> Khi tích hợp vào dự án Client (Workspace):
> - Thư mục `commands/` ở gốc repository sẽ được sao chép và đồng bộ trực tiếp ra thư mục `.agents/skills/` của dự án client để IDE nhận diện thành các phím tắt lệnh gõ nhanh bắt đầu bằng dấu `/` (ví dụ: `/sk-ba`, `/sk-feature`,...).
> - Toàn bộ repository (bao gồm `rules/`, `skills/`, `workflows/`, `templates/`) sẽ được copy gọn gàng vào bên trong `sk-specs/` của Client (ví dụ: `sk-specs/rules/`, `sk-specs/skills/`, v.v.), giúp cô lập hoàn toàn và tránh làm ô nhiễm thư mục `.agents/` gốc của client (đảm bảo không ghi đè lên các rule/skill riêng của dự án client).


# HƯỚNG DẪN CÀI ĐẶT & ĐỒNG BỘ (INSTALLATION & SYNC)

Để tích hợp cấu trúc quy trình phát triển này vào dự án client (Workspace), bạn có thể sử dụng một trong hai phương thức sau:

### Cách 1: Sử dụng `npx` (Khuyên dùng khi lấy trực tiếp từ GitHub)

Do hạn chế của npm trong việc tự động suy đoán tên lệnh từ Git URL, bạn cần chỉ định rõ gói cài đặt thông qua `-p` và tên lệnh thực thi ở cuối.

Mở terminal tại thư mục gốc của dự án client và chạy lệnh:

```bash
npx -p github:sunkid1995/sk-specs sk-specs
```

Lệnh này sẽ tự động tải các quy chuẩn mới nhất, khởi tạo thư mục `.agents/` nếu chưa có và đồng bộ toàn bộ rules, skills, workflows, templates vào dự án của bạn.

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

# HƯỚNG DẪN SỬ DỤNG SLASH COMMANDS (QUY TRÌNH VIẾT TẮT)

Để tăng tốc độ kích hoạt workflow, bạn có thể gõ trực tiếp các câu lệnh bắt đầu bằng dấu gạch chéo `/` trong khung chat. AI Agent sẽ tự động chuyển sang workflow tương ứng:

| Lệnh                   | Workflow kích hoạt  | Hành động của Agent                                                              |
| :--------------------- | :------------------ | :------------------------------------------------------------------------------- |
| `/sk-ba <mô-tả>`       | Business Analysis   | Tạo hoặc cập nhật `ba.md` và dừng tại Checkpoint 1 (BA Approval).                |
| `/sk-feature <mô-tả>`  | Feature Development | Kiểm tra `ba.md`, tạo `feature.md` và dừng tại Checkpoint 2 (Design Approval).   |
| `/sk-bugfix <mô-tả>`   | Bug Fix             | Phân tích bug, lập kế hoạch sửa lỗi trong `fix-bug.md` và dừng tại Checkpoint 2. |
| `/sk-refactor <mô-tả>` | Safe Refactoring    | Lập kế hoạch tái cấu trúc trong `refactor.md` và dừng tại Checkpoint 2.          |
| `/sk-review`           | Code Review         | Tự động quét diff các file đã thay đổi và sinh đánh giá trong `review.md`.       |
| `/sk-continue`         | Resume Progress     | Tự động đọc spec hiện tại và tiếp tục công việc đang dang dở.                    |
| `/sync` / `/update`    | Synchronize Rules   | Hướng dẫn hoặc chạy script đồng bộ hóa rules từ upstream repository.             |

Chi tiết cấu hình các lệnh có thể xem tại thư mục [commands/](commands/).

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

## commands/ (Đồng bộ thành .agents/skills/ tại Client)

Custom Slash Commands registered to Antigravity IDE.

Responsible for:

- registering custom slash commands (e.g., `/sk-ba`, `/sk-feature`, `/sk-bugfix`, `/sk-refactor`, `/sk-review`, `/sk-continue`)
- orchestrating specific workflows and template file generation
- defining interactive checkpoint approvals with the user

---

## sk-specs/

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
sk-specs/<work-item-name>/
```

without requiring explicit user instructions.

---

# DEFAULT GENERATED SPEC FILES

## Feature Workflow

```txt
sk-specs/<feature-name>/
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
sk-specs/<bug-name>/
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
sk-specs/<refactor-name>/
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
   `sk-specs/`

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

# SOFTWARE DEVELOPMENT WORKFLOW BENEFITS

- smaller prompts
- deterministic outputs
- reusable engineering workflows
- persistent engineering memory
- lower implementation context size
- safer bugfix workflows
- safer refactor workflows
- reduced regression risk
- support for multi-agent collaboration (optional)
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
sk-specs/
```
