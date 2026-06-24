---
trigger: always_on
name: guru-architecture-rules
version: 1.0.0
description: Định nghĩa các nguyên lý kiến trúc hệ thống chuẩn mực (SOLID, Coupling, Cohesion, Encapsulation) theo tinh thần Guru.
label: guru
---

# CORE OBJECTIVE

Mục tiêu tối thượng không chỉ là làm cho code chạy được, mà phải xây dựng các hệ thống dễ bảo trì, giảm thiểu nợ kỹ thuật (technical debt), bảo vệ tính toàn vẹn của kiến trúc và tối ưu hóa chi phí phát triển tương lai.

Code chạy được là điều kiện cần. Code dễ bảo trì là bắt buộc.

---

# SOLID PRINCIPLES

Mọi triển khai mã nguồn mới đều phải tuân thủ nghiêm ngặt nguyên lý SOLID:

### 1. Single Responsibility Principle (SRP)
- Mỗi mô-đun hoặc component chỉ nên có duy nhất một lý do để thay đổi.
- **Tránh**: Các service đa năng (multi-purpose), trộn lẫn logic nghiệp vụ và hiển thị UI, các lớp tiện ích (utility classes) quá lớn.

### 2. Open/Closed Principle (OCP)
- Hệ thống nên mở rộng cho việc phát triển thêm tính năng mới nhưng đóng lại trước việc sửa đổi các mô-đun cốt lõi hiện có.
- **Ưu tiên**: Sử dụng Interfaces, Strategy Pattern, Composition.
- **Tránh**: Các cây điều kiện lặp đi lặp lại hoặc liên tục sửa đổi trực tiếp vào các mô-đun ổn định.

### 3. Liskov Substitution Principle (LSP)
- Các lớp/mô-đun dẫn xuất phải kế thừa và tôn trọng hợp đồng hành vi của lớp/mô-đun cha mà không thay đổi bản chất của nó.

### 4. Interface Segregation Principle (ISP)
- Ưu tiên các interfaces nhỏ gọn, tập trung vào nhiệm vụ cụ thể thay vì các interfaces cồng kềnh chứa các phương thức không sử dụng.

### 5. Dependency Inversion Principle (DIP)
- Phụ thuộc vào các trừu tượng (abstractions/interfaces) thay vì phụ thuộc trực tiếp vào các implementation hoặc thư viện concrete bên ngoài.

---

# ARCHITECTURE RULES

### 1. Prefer Composition Over Inheritance
- Luôn ưu tiên Composition (ủy quyền/kết hợp) thay vì Inheritance (kế thừa). Kế thừa chỉ nên dùng khi thực sự cần thiết và có chủ đích rõ ràng.

### 2. Minimize Coupling (Giảm thiểu kết nối)
- Một mô-đun nên biết càng ít càng tốt về các mô-đun khác. Tránh rò rỉ dữ liệu hoặc gọi trực tiếp vào cấu trúc nội bộ của mô-đun khác.

### 3. Maximize Cohesion (Tối đa hóa tính gắn kết)
- Các logic chức năng liên quan mật thiết bắt buộc phải được đặt cùng nhau. Tránh các "god services" hoặc "god components".

### 4. Encapsulation (Tính đóng gói)
- Ẩn giấu chi tiết triển khai nội bộ, chỉ expose ra ngoài những API hoặc thuộc tính tối thiểu cần thiết cho phía sử dụng.
