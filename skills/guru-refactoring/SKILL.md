---
name: guru-refactoring
description: Kỹ năng chuyên sâu giúp phát hiện các code smells, kích hoạt quy trình refactor mã nguồn và lựa chọn mẫu thiết kế (Design Patterns) phù hợp theo tiêu chuẩn Guru.
label: guru
---

## CODE SMELL DETECTION & REFACTORING TRIGGERS

Hãy chủ động phát hiện và thực hiện refactor ngay lập tức khi phát hiện các dấu hiệu (triggers) sau:

| Code Smell | Dấu hiệu nhận biết (Indicators) | Hướng xử lý đề xuất (Preferred Fix) |
| :--- | :--- | :--- |
| **Long Method** | Hàm dài > 50 dòng, ôm đồm nhiều nhiệm vụ. | **Extract Method** (Tách hàm nhỏ). |
| **Large Class** | File/Lớp > 300 dòng, quản lý nhiều domains/dependencies. | **Extract Class** (Tách class/hooks/file con). |
| **Duplicate Code** | Logic hoặc cấu trúc lặp lại từ 2 lần trở lên. | **Extract reusable abstraction** (Tái sử dụng utility/hook). |
| **Long Parameter List** | Hàm nhận nhiều hơn 4 tham số đầu vào. | **Parameter Object** (Gom nhóm thành object). |
| **Primitive Obsession** | Lạm dụng kiểu cơ bản (string, number) cho cấu trúc dữ liệu, magic values. | **Value Objects / Enums / Types**. |
| **Feature Envy** | Một hàm truy cập dữ liệu của đối tượng khác nhiều hơn dữ liệu của chính nó. | **Move Method** (Di chuyển hàm về đúng đối tượng chứa dữ liệu). |
| **Data Clumps** | Một nhóm tham số luôn đi cùng nhau ở nhiều nơi. | **Value Object** (Đóng gói thành object/type chung). |
| **Message Chains** | Gọi chuỗi liên tục dạng `a.b().c().d()`. | **Encapsulation / Facade** (Che giấu chuỗi xử lý phức tạp). |
| **Switch Explosion** | `switch` có > 5 cases hoặc nhánh `if/else` lồng > 3 cấp. | **Strategy Pattern / Polymorphism**. |

---

## DESIGN PATTERN SELECTION GUIDE

Hãy chọn lựa các mẫu thiết kế (Design Patterns) một cách thông minh và có chủ đích:

### 1. Strategy Pattern
- **Khi nào dùng**: Logic xử lý thay đổi linh hoạt theo cấu hình (ví dụ: các chiến lược hiển thị tin nhắn, cách tính toán, thay đổi model).
- **Tránh**: Sử dụng if/else hoặc switch case khổng lồ để rẽ nhánh hành vi.

### 2. Factory Pattern
- **Khi nào dùng**: Khởi tạo các biến thể (variants) của dịch vụ, đăng ký các công cụ (tool registries), hoặc tạo instance động.
- **Tránh**: Nhồi nhét constructor logic rẽ nhánh phức tạp trực tiếp ở hàm gọi.

### 3. Builder Pattern
- **Khi nào dùng**: Tạo lập các đối tượng phức tạp với nhiều bước cấu hình khác nhau.
- **Tránh**: Sử dụng hàm khởi tạo (constructors) với quá nhiều tham số.

### 4. Adapter Pattern
- **Khi nào dùng**: Tích hợp các API bên ngoài, bao bọc (wrapping) các SDK từ bên thứ ba để tránh rò rỉ mã nguồn thư viện ngoài ra toàn ứng dụng.

### 5. Facade Pattern
- **Khi nào dùng**: Khi cần đơn giản hóa giao diện giao tiếp với một hệ thống con (subsystem) phức tạp.

### 6. Chain of Responsibility
- **Khi nào dùng**: Xây dựng middleware, các đường ống xác thực (validation pipelines), hoặc các công cụ xử lý request tuần tự.
