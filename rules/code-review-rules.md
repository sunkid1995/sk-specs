---
trigger: always_on
---

---

name: code-review-rules
version: 1.0.0

---

# CODE REVIEW RULES

## Review Priorities

Review dimensions in priority order:

1. Correctness
2. Security
3. Architecture compliance
4. Maintainability
5. Performance
6. Testing coverage
7. UI/UX consistency
8. Style and naming

## Severity Classification

- 🔴 **Critical** — bugs, security issues, data loss risk → must fix (Blocker)
- 🟡 **Important** — architecture violations, maintainability issues, moderate performance or concurrency issues → should fix before merge
- 🔵 **Minor** — style, naming, small optimizations → fix if time permits
- 🟢 **Positive / Nitpick** — good implementations, patterns to encourage, or small non-blocking suggestions

## Review Constraints

- Do NOT rewrite code unless requested
- Be specific — file, line, issue, suggestion
- Distinguish blocking issues from suggestions
- Reference project rules and conventions
- Verify against existing specs in `sk-specs/`

## Project-Specific Checks

Always verify:

- No `any` type usage
- Path aliases used correctly
- UI text uses `t('key')`
- Zustand follows `devtools(immer(...))` pattern
- Server data uses TanStack Query
- Separate style files for components
- kebab-case filenames
- Default exports for components
- `cn()` for className merging
- No `console.*` in production paths

## Output Requirements

Báo cáo review (`code-review.md`) phải tuân thủ cấu trúc sau:

1. **Đánh giá tổng thể**:
   - Tóm tắt thay đổi (What & Why), các module bị ảnh hưởng.
   - Đánh giá tổng quan chất lượng code và độ tuân thủ kiến trúc.
   - Đưa ra quyết định đánh giá: Approve / Needs Changes / Block.
2. **Đánh giá bổ sung**:
   - Nhận định sâu hơn về thiết kế, tính mở rộng, khả năng bảo trì.
   - So sánh giải pháp mới và giải pháp cũ nếu có.
3. **Các điểm rủi ro và cần lưu ý**:
   - Phân tích chi tiết rủi ro tiềm ẩn (Race conditions, Side effects, Memory leak, Performance, v.v.).
   - Trình bày dạng bảng đánh giá mức độ rủi ro (Cao / Trung bình / Thấp) kèm giải pháp giảm thiểu (Mitigation).
4. **Đánh giá chi tiết mã nguồn (Detailed Code Review)**:
   - Danh sách chi tiết các phát hiện sử dụng ký hiệu dot color tương ứng (🔴, 🟡, 🔵, 🟢).
   - Chỉ rõ file, dòng code (nếu có), vấn đề phát hiện và đề xuất sửa đổi cụ thể.
