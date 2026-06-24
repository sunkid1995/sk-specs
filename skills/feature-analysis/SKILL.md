---
name: feature-analysis
description: Analyze features, requirements, state management needs, and architectural risks to generate a structured implementation roadmap. Trigger this skill whenever the user requests analyzing a feature or provides a prompt starting with 'Feature:'.
---

# Feature Analysis Behavior

```mermaid
graph TD
    Start([Bắt đầu Phân tích Tính năng]) --> VerifyBA[1. Xác thực ba.md tồn tại & đã duyệt]
    VerifyBA --> CheckBA{ba.md đã được duyệt?}
    CheckBA -- Chưa --> TriggerBA[Kích hoạt quy trình /ba trước] --> VerifyBA
    CheckBA -- Rồi --> CreateFeature[2. Tạo/Cập nhật feature.md theo template]
    CreateFeature --> PhasedPlan[3. Lập kế hoạch phân rã phases & ưu tiên data layer]
    PhasedPlan --> DefineRisks[4. Đánh giá rủi ro kiến trúc & lập test cases]
    DefineRisks --> Checkpoint[5. Design Approval Checkpoint]
    Checkpoint --> WaitUser{User đồng ý Thiết kế kỹ thuật?}
    WaitUser -- Không/Chỉnh sửa --> UpdatePlan[Cập nhật feature.md] --> Checkpoint
    WaitUser -- Có --> End([Hoàn thành Thiết kế - Sẵn sàng Code])
```

When a feature request is initiated via a prompt starting with `Feature:`, automatically analyze the requirements and draft a technical roadmap before writing any implementation code.

All outputs must be written directly to `sk-specs/<normalized-feature-name>/01-feature-analysis.md` (or printed clearly if no spec directory exists yet).

## Required Output Sections

The analysis must strictly follow the output format requirements:

- **Feature Summary**: Short overview of the feature scope, target value, and affected modules.
- **Requirements Analysis**: Detail the functional requirements, technical/API needs, state persistence requirements, and UI/UX state behaviors (loading, empty, error states).
- **Implementation Phases**: Divide the implementation into incremental, testable phases. Ensure data/store layers are ordered before UI components.
- **Reusable Modules**: Identify shared hooks, storage wrappers, or components that can be extracted or reused.
- **Technical Risks**: Assess potential edge cases, race conditions, sync issues, or data integrity risks.
- **Execution Order**: Map out the exact implementation sequence and dependencies.
- **Validation Strategy**: Plan how to verify the changes via unit, integration, and regression tests.

## Key Restrictions

- Do NOT implement production code unless explicitly requested.
- Do NOT generate unnecessary boilerplate or overengineer simple features.
