---
name: sk-status
description: Trigger Status Dashboard — scan active specs and summarize current work items status.
---

# Skill: sk-status

## Trigger

This skill activates when the user types `/sk-status` in the chat.

## Behavior

When triggered, the Agent MUST:

1. **Quét thư mục `sk-specs/active/`** tại root của client workspace.
2. **Liệt kê tất cả work items đang active**, mỗi item bao gồm:
   - Tên work item (tên thư mục)
   - Loại task (Feature / Bugfix / Refactor) — suy ra từ file tồn tại (`feature.md` / `fix-bug.md` / `refactor.md`)
   - Pha hiện tại — suy ra từ các file đã tồn tại:
     - Chỉ có `ba.md` → **Pha BA**
     - Có `feature.md`/`fix-bug.md`/`refactor.md` → **Pha Design**
     - Có `progress.md` với task `[/]` hoặc `[x]` → **Pha Code**
     - Có `review.md` → **Pha Review**
   - Tiến độ hoàn thành — đếm tỷ lệ `[x]` / tổng tasks trong `progress.md`
   - Thời gian cập nhật cuối — lấy `mtime` của file được chỉnh sửa gần nhất trong thư mục
3. **Quét thư mục `sk-specs/completed/`** và báo cáo số lượng task đã hoàn thành.
4. **Hiển thị kết quả** dưới dạng bảng markdown tổng hợp.

## Output Format

```markdown
## 📊 Tiến Độ Công Việc (Work Items)

### Active Work Items (N items)

| #   | Work Item | Loại    | Pha hiện tại | Tiến độ   | Cập nhật cuối    |
| :-- | :-------- | :------ | :----------- | :-------- | :--------------- |
| 1   | <tên>     | Feature | Pha Code     | 3/5 (60%) | 2026-06-18 14:30 |

### Completed: M items | Archived: K items
```

## Rules

- Không tạo hoặc chỉnh sửa bất kỳ file nào.
- Chỉ đọc và tổng hợp thông tin.
- Nếu không tìm thấy task nào trong `active/`, thông báo: _"Không có work item nào đang active. Sử dụng `/sk-ba`, `/sk-feature`, `/sk-bugfix` hoặc `/sk-refactor` để bắt đầu."_
