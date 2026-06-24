---
trigger: always_on
---

---

name: code-styling
version: 1.0.0

---

# COMPONENT DESIGN & SPLITTING

### Quy tắc chia tách Component (Smart & Dumb)
- **Container/Smart Component (hoặc Custom Hook `useXxx`)**: Tách logic xử lý trạng thái phức tạp, quản lý state hoặc các tác vụ bất đồng bộ (async API) ra component cha hoặc custom hook.
- **Presentational/Dumb Component**: Component con chỉ nhận dữ liệu thông qua props để render giao diện nhằm tăng tính tái sử dụng và khả năng kiểm thử.
- **Giới hạn kích thước**: Khuyến nghị giới hạn dòng code cho một tệp Component dưới **150 dòng** để giữ cấu trúc tinh gọn và dễ bảo trì.

---

# COMPONENT STYLING (TAILWIND vs SCSS)

### Ranh giới sử dụng TailwindCSS và SCSS Modules
- **TailwindCSS**: Chỉ sử dụng cho việc căn chỉnh bố cục nhanh (flex, grid, spacing, layout structure cơ bản).
- **SCSS Module (`*.module.scss`)**: Bắt buộc sử dụng CSS Modules là ưu tiên cao nhất đối với:
  - Mọi cấu hình liên quan đến màu sắc (border, background, text color).
  - Hiệu ứng hover, active, focus.
  - Các animation, transition phức tạp.
  - Responsive phức tạp.
  - Khi một phần tử JSX chứa quá nhiều class Tailwind (> 4-5 classes) làm giảm tính dễ đọc của code.

---

# UI & THEME COMPATIBILITY

### Hỗ trợ Light/Dark Theme
- Luôn luôn đảm bảo các component thiết kế hoạt động tốt trên cả hai chế độ sáng (Light) và tối (Dark).
- **Tuyệt đối tránh sử dụng mã màu cứng (hardcoded hex/rgb)**. Bắt buộc phải sử dụng các CSS variables hoặc theme tokens được định nghĩa tập trung của hệ thống để quản lý màu sắc theme linh hoạt.

---

# LOCALIZATION (i18n)

### Bắt buộc sử dụng i18n cho giao diện
- Tuyệt đối không hardcode trực tiếp văn bản hiển thị giao diện.
- Bắt buộc sử dụng hook `useTranslation` từ `@lib/i18n` để dịch các chuỗi UI thông qua hàm `t('key')`.

* ✅ **Ví dụ chuẩn**:
  ```tsx
  import { useTranslation } from '@lib/i18n';
  import styles from './index.module.scss';

  function MyComponent() {
    const { t } = useTranslation();
    return <div className={styles.container}>{t('title')}</div>;
  }

  export default MyComponent;
  ```
