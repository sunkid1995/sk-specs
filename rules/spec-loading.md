---
trigger: always_on
description: Quy định luồng hoạt động của Agent khi đọc và tải tài liệu đặc tả (specification) của dự án để tối ưu hóa dung lượng ngữ cảnh.
---

---

name: spec-loading
version: 1.0.0
description: Quy định luồng hoạt động của Agent khi đọc và tải tài liệu đặc tả (specification) của dự án để tối ưu hóa dung lượng ngữ cảnh.

---

# SPEC LOADING BEHAVIOR

## Nguyên tắc cốt lõi

Đọc ít nhất có thể. Đọc đúng file cần thiết.

**Không bao giờ** đọc toàn bộ `sk-specs/` một lúc.

---

## Khi nào phải đọc spec

Bắt buộc khi task là **Feature / Bugfix / Refactor**:

1. Luôn sử dụng tool `list_dir` để liệt kê nội dung thư mục `sk-specs/` nhằm xác định xem đã tồn tại folder spec liên quan đến task hiện tại chưa.
2. Nếu folder spec đã tồn tại (ví dụ: `sk-specs/<task-name>/`), **BẮT BUỘC** gọi tool `view_file` để đọc trực tiếp file `sk-specs/<task-name>/_index.md` NGAY LẬP TỨC.
3. Chạy `node .agents/hooks/pre-ba.js <task-name>` — đọc output.
4. Nếu `pre-ba` báo conflict hoặc tương đồng (exit code 2) với các spec khác, sử dụng tool `view_file` để đọc file `_index.md` của các spec đó.

---

## Thứ tự đọc (bắt buộc)

### Bước 1 — Đọc `_index.md` của task hiện tại

Nếu task name match với folder trong `sk-specs/`, sử dụng tool `view_file` để đọc:

```
sk-specs/<task-name>/_index.md
```

File này cho biết: danh sách files bị ảnh hưởng, risk, status và search keywords.

### Bước 2 — Kiểm tra conflict / similar

`pre-ba hook` in ra danh sách task `active` hoặc tương đồng.  
Đọc `_index.md` của các task đó nếu cần xem scope overlap.

### Bước 3 — Chỉ đọc detail khi thực sự cần

| Khi nào cần đọc       | File cần đọc              |
| --------------------- | ------------------------- |
| Cần hiểu kiến trúc cũ | `02-architecture.md`      |
| Cần task breakdown    | `03-task-breakdown.md`    |
| Cần biết root cause   | `02-root-cause.md`        |
| Cần regression check  | `regression-checklist.md` |

**Không đọc tất cả 4 file trừ khi bắt buộc.**

---

## Priority Order

1. `_index.md` của task hiện tại (nếu có) — **ĐỌC NGAY**
2. `_index.md` của task conflict/similar (nếu pre-ba báo)
3. Detail file của task hiện tại (chỉ khi cần)
4. New analysis từ user prompt

---

## Quy tắc bỏ qua

Bỏ qua spec nếu:

- `status: done` trong `_index.md` và task hiện tại không liên quan
- Không có file nào overlap với task hiện tại
- Spec folder được tạo cách đây > 30 ngày và không có task breakdown active
