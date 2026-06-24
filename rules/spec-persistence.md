---
trigger: always_on
description: Hướng dẫn tự động tạo và lưu trữ tài liệu đặc tả (specification) mới theo đúng cấu trúc sk-specs cho mọi tác vụ feature, bugfix hoặc refactor.
---

---

name: spec-persistence
version: 2.1.0
description: Hướng dẫn tự động tạo và lưu trữ tài liệu đặc tả (specification) mới theo đúng cấu trúc sk-specs cho mọi tác vụ feature, bugfix hoặc refactor.

---

# SPEC PERSISTENCE BEHAVIOR

Tự động sinh spec cho mọi task: feature, bugfix, refactor, code review.

Lưu vào:

```
sk-specs/<kebab-case-task-name>/
```

---

# TRƯỚC KHI TẠO SPEC MỚI (BẮT BUỘC)

**Khi `pre-ba` trả về exit code 2**, Agent PHẢI dừng lại và hỏi user:

> _"Tôi tìm thấy các spec sau có thể liên quan đến yêu cầu này:_
> _[Liệt kê danh sách từ output pre-ba]_
> _Yêu cầu này là **cập nhật** spec đã có hay **tạo mới** hoàn toàn?"_

**Nếu user chọn cập nhật**: Bổ sung vào spec folder đã có, **KHÔNG** tạo folder mới.

**Nếu user chọn tạo mới**: Tạo folder `sk-specs/<task-name>/` và tiếp tục quy trình bình thường.

**Chỉ tạo folder mới ngay lập tức khi:**

- `pre-ba` trả về exit code 0 (không có spec tương đồng), **hoặc**
- User đã xác nhận rõ ràng đây là task mới.

---

# BẮT BUỘC: \_index.md

Mỗi spec folder PHẢI có file `_index.md` tối đa 8 dòng:

```md
task: <tên task ngắn gọn>
type: feature | bugfix | refactor | review
files:

- <path/to/file1>
- <path/to/file2>
  risk: <rủi ro quan trọng nhất, 1 câu>
  status: active | done
  search: <keyword1>, <keyword2>, <keyword3>
```

Field `search` chứa các keyword segment mô tả domain/concept của task.
Dùng để Agent phát hiện semantic overlap với spec khác mà không cần đọc chi tiết.

Ví dụ keyword tốt: `todo, filter, dateRange, toggle, important, checklist`
Không dùng: `fix, refactor, bug, feature, index, component, src`

---

# FORMAT SPEC (BẮT BUỘC)

## Giới hạn kích thước

- Mỗi file spec: **tối đa 80 dòng**
- Sử dụng Mermaid diagram tối giản khi mô tả flow hoạt động, hướng xử lý trong 02-architecture.md
- Không ghi narrative/bối cảnh dài
- Không ghi update log (`Cập nhật DD/MM`)
- Không lặp thông tin giữa các file

## Cấu trúc bắt buộc — 4 section

Mỗi section tối đa **10 dòng**:

```
## What
Thay đổi gì. Bullet point.

## Why
Lý do kỹ thuật. 1–3 câu.

## Where
Danh sách file bị ảnh hưởng (path đầy đủ).

## Risk
Rủi ro quan trọng nhất. Tối đa 3 bullet.
```

---

# FILES TỰ ĐỘNG SINH

## Feature

- `_index.md`
- `01-feature-analysis.md` — What + Why
- `02-architecture.md` — Where + thiết kế type/API
- `03-task-breakdown.md` — danh sách task có checkbox

## Bugfix

- `_index.md`
- `01-bug-analysis.md` — What + Where
- `02-root-cause.md` — Why (root cause chain)
- `03-fix-strategy.md` — fix + regression check

## Refactor

- `_index.md`
- `01-refactor-analysis.md` — What + Why
- `02-refactor-plan.md` — Where + thiết kế
- `03-risk-analysis.md` — Risk + regression

---

# QUY TẮC VIẾT

- Dùng bullet point, không dùng đoạn văn
- Code block chỉ cho type definition và API signature
- Không giải thích những gì đã rõ ràng từ code
- Ưu tiên path đầy đủ thay vì tên component
- Không ghi lại những gì user đã nói — chỉ ghi quyết định kỹ thuật
- Khi cần chèn liên kết tệp (file links) vào tài liệu đặc tả trong `sk-specs/`, bắt buộc sử dụng đường dẫn tương đối (relative path, ví dụ: `[filename](../../src/path/to/file)`) thay vì đường dẫn tuyệt đối.
