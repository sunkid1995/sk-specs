---
trigger: always_on
---

---

name: output-format
version: 1.1.0

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

- List of existing workspace components, functions, hooks, or styles that will be reused (must perform search first)
- Adaptation or extension strategy for existing code to prevent duplicates
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
- reusable modules and existing codebase elements to be reused (must perform search to prevent duplicate implementation)
- type definitions
- separation boundaries
- persistence flow
- scalability considerations

# CODE REVIEW OUTPUT

When reviewing code, ALWAYS generate:

## 1. Đánh giá tổng thể (Overall Assessment)

- **Tóm tắt thay đổi**: Tóm tắt ngắn gọn những gì đã thay đổi và lý do thay đổi.
- **Phạm vi ảnh hưởng**: Các module và chức năng bị tác động trực tiếp hoặc gián tiếp.
- **Chất lượng code & Kiến trúc**: Đánh giá mức độ sạch của code, sự tách biệt trách nhiệm và tuân thủ các quy tắc kiến trúc của dự án.
- **Trạng thái đánh giá**: **Approve** / **Needs Changes** / **Block** kèm theo lý do ngắn gọn.

## 2. Đánh giá bổ sung (Additional Assessment)

- Phân tích sâu hơn về mặt kỹ thuật, khả năng tái sử dụng, tính mở rộng trong tương lai.
- Đánh giá sự khác biệt và hiệu quả giữa phương án mới với kiến trúc cũ.
- Các gợi ý thiết kế nâng cao (nếu có).

## 3. Các điểm rủi ro và cần lưu ý (Risks & Notes)

- Phân tích các rủi ro kỹ thuật tiềm ẩn như:
  - **Race Conditions**: Xử lý bất đồng bộ khi user thao tác nhanh (spam click).
  - **Side-effects**: Các tác động phụ ngoài ý muốn lên state toàn cục hoặc các component khác.
  - **Performance & Memory**: Tránh re-render thừa, memory leak, rò rỉ bộ nhớ, tối ưu hóa API.
  - **Data Integrity**: Bảo đảm dữ liệu không bị sai lệch giữa client và server.
- Trình bày bảng rủi ro theo định dạng:
  | Rủi ro | Mức độ (Cao/Trung bình/Thấp) | Cần khắc phục ngay? (Có/Không) | Giải pháp giảm thiểu (Mitigation) |
  |---|---|---|---|

## 4. Đánh giá chi tiết mã nguồn (Detailed Code Review)

Sử dụng các dot color cụ thể sau đây cho từng phát hiện trong mã nguồn:

- 🔴 **Critical (Đỏ)**: Lỗi logic, lỗi bảo mật, nguy cơ crash, rò rỉ dữ liệu quan trọng. Bắt buộc phải sửa trước khi merge (Blocker).
- 🟡 **Important (Vàng)**: Vi phạm kiến trúc dự án, vi phạm rules, nguy cơ race condition/memory leak vừa phải. Khuyến nghị sửa trước khi merge.
- 🔵 **Minor (Xanh dương)**: Code smell, tối ưu hóa cú pháp, cải thiện khả năng đọc hiểu code. Có thể sửa sau.
- 🟢 **Positive (Xanh lá)**: Đánh giá cao các giải pháp tốt, clean code, áp dụng đúng pattern.

Định dạng cho mỗi phát hiện:
- **Ký hiệu & Mức độ**: `🔴 Critical` | `🟡 Important` | `🔵 Minor` | `🟢 Positive`
- **Vị trí**: [filename.tsx:L12-L15](file:///path/to/filename.tsx#L12-L15)
- **Vấn đề**: Mô tả chi tiết vấn đề hoặc điểm tốt phát hiện được.
- **Đề xuất sửa đổi**: (Nếu có rủi ro/lỗi) Cung cấp đoạn code đề xuất hoặc giải pháp thay thế.
