---
trigger: always_on
---

---

name: architecture-rules
version: 1.1.0

---

# FRONTEND ARCHITECTURE RULES

- Prefer feature-based architecture
- Separate UI, state, persistence, and domain concerns
- Shared modules must remain framework-agnostic when possible
- Keep feature state isolated
- Avoid global state pollution

# STATE MANAGEMENT RULES

- Zustand should be modularized by feature
- Persisted state must be isolated from transient state
- State shape must be typed explicitly
- Avoid direct storage access inside components

# STORAGE RULES

- All storage access should go through a wrapper layer
- Support future migration from localStorage to other persistence layers
- Define storage keys centrally
- Handle invalid persisted values safely

# REUSABILITY RULES

- Shared hooks belong in shared/hooks
- Shared storage utilities belong in shared/storage
- Shared types belong in shared/types
- Avoid duplicate persistence logic
- Check the workspace thoroughly for existing helper functions, hooks, or components before writing new ones
- Abstract common patterns into reusable utilities or components only when they are used in multiple features
- Keep shared code highly modular, flexible (using customizable props or options), and documented to ensure others can reuse it easily

# SCALABILITY RULES

- Design for future multi-tab support
- Design for future user preference persistence
- Design for future server synchronization
- Avoid hardcoded feature assumptions

# API DEVELOPMENT & USAGE RULES

### 1. Quy tắc viết API (API Definition)
- Triển khai hàm gọi API mới dưới dạng hàm `async/await` dùng `httpClient` trực tiếp.
- Tên hàm gọi API bắt buộc phải có hậu tố `Api` ở cuối.
- Không tự ý tạo custom hooks gọi API (chỉ tạo khi có yêu cầu cụ thể).

* ✅ **Đúng (Correct)**:
  ```ts
  export const subscribeBirthdayApi = async (userIds: string[]): Promise<void> => {
    await httpClient.post(URL, { userIds });
  };
  ```
* ❌ **Sai (Incorrect)**:
  ```ts
  // Thiếu hậu tố Api, hoặc tự ý bọc trong custom hook
  export const subscribeBirthday = async (userIds: string[]) => { ... };
  export function useSubscribeBirthday() { ... } 
  ```

### 2. Quy tắc sử dụng API (API Usage)
- Khi gọi/sử dụng một API trong ứng dụng, bắt buộc sử dụng khối lệnh `try/catch` để tránh crash ứng dụng và xử lý phản hồi giao diện an toàn.

* ✅ **Đúng (Correct)**:
  ```ts
  try {
    setIsLoading(true);
    await subscribeBirthdayApi(ids);
    toast.success(t('success'));
  } catch (error) {
    toast.error(t('error'));
  } finally {
    setIsLoading(false);
  }
  ```
* ❌ **Sai (Incorrect)**:
  ```ts
  // Không có try/catch để bắt lỗi
  setIsLoading(true);
  await subscribeBirthdayApi(ids);
  setIsLoading(false);
  ```

