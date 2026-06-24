---
trigger: always_on
name: guru-code-rules
version: 1.0.0
description: Thiết lập các tiêu chuẩn viết code TypeScript, cấu trúc React Component, quy trình Test và kiểm soát thư viện ngoài.
label: guru
---

# TYPESCRIPT STANDARDS

- **Tuyệt đối cấm sử dụng kiểu `any`** trong mọi trường hợp.
- **Tránh ép kiểu không an toàn**: Hạn chế tối đa sử dụng `as unknown as` hoặc ép kiểu cưỡng chế (unsafe casting).
- **Ưu tiên**: Sử dụng `interface`, `type`, `readonly`, `enum` và `discriminated unions`.
- **Public APIs**: Mọi API hoặc module export ra ngoài bắt buộc phải được khai báo tường minh kiểu dữ liệu (strongly typed), không sử dụng implicit contracts.

---

# REACT STANDARDS

### 1. Kích thước Component
- **Khuyến nghị**: Dưới 200 dòng code.
- **Tối đa**: Không vượt quá 300 dòng code cho một tệp Component.

### 2. Phân chia trách nhiệm
- Tránh nhồi nhét việc fetch dữ liệu, quản lý state phức tạp, rendering UI và logic nghiệp vụ vào chung một component.
- **Ưu tiên**: Sử dụng Custom Hooks, cấu trúc Composition và phân tách module theo tính năng (Feature Modules).
- **Tránh**: Prop drilling quá sâu, cấu trúc cây JSX quá lớn, hoặc logic hiển thị điều kiện quá phức tạp (complex conditional rendering).

---

# TESTING STANDARDS

- Mọi logic nghiệp vụ quan trọng và hành vi cốt lõi của ứng dụng đều phải có khả năng kiểm thử được (testable).
- **Ưu tiên**: Viết Unit tests và Integration tests để bảo vệ code trước các thay đổi.
- **Tránh**: Viết logic nghiệp vụ ẩn hoặc lồng sâu không thể tiếp cận để viết test được.

---

# DEPENDENCY RULES

Trước khi cài đặt bất kỳ thư viện (dependency) mới nào từ bên ngoài, bắt buộc phải đánh giá:
1. **Necessity**: Có thực sự cần thiết hay có thể tự viết gọn nhẹ?
2. **Maintenance Status**: Thư viện còn được bảo trì tích cực không?
3. **Community Adoption**: Cộng đồng sử dụng có lớn và uy tín không?
4. **Bundle Impact**: Kích thước bundle tăng thêm bao nhiêu?
5. **Security Implications**: Có rủi ro bảo mật tiềm ẩn nào không?

Tránh lạm dụng cài đặt thư viện bên thứ ba khi không cần thiết.
