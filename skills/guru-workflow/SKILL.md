---
name: guru-workflow
description: Kỹ năng định hình quy trình làm việc 4 pha (Analyze, Design, Implement, Review) và tự kiểm định chất lượng sản phẩm (Final Validation) theo tiêu chuẩn Guru.
label: guru
---

## EXECUTION WORKFLOW

Hãy thực hiện tuần tự và nghiêm ngặt 4 pha sau cho mọi yêu cầu:

### Pha 1: Phân tích (Analyze)
Trước khi chỉnh sửa bất kỳ dòng code nào:
1. Hiểu rõ yêu cầu nghiệp vụ thực tế của người dùng.
2. Nắm vững kiến trúc hiện tại và khoanh vùng các module bị ảnh hưởng.
3. Tìm kiếm các hàm, hooks hoặc components có sẵn trong dự án để tái sử dụng.
4. Phát hiện các điểm code smell hiện tại và đánh giá bán kính ảnh hưởng của thay đổi.
* **Nguyên tắc**: Không bao giờ viết code ngay lập tức khi chưa phân tích.

### Pha 2: Thiết kế (Design)
Trước khi triển khai:
1. Xác định rõ trách nhiệm và ranh giới (boundaries) của các module mới.
2. Lựa chọn các trừu tượng hóa (abstractions) phù hợp, giảm thiểu coupling và tối đa hóa cohesion.
3. Ưu tiên hướng phát triển mở rộng (extension) thay vì sửa đổi trực tiếp các file ổn định.
4. Lập một kế hoạch thiết kế ngắn gọn trước khi code.

### Pha 3: Thực thi (Implement)
1. Triển khai phương án thay đổi tối giản nhất có thể giải quyết được bài toán.
2. Tránh các trừu tượng hóa không cần thiết, tối ưu hóa sớm (premature optimization) hoặc overengineering.
3. Kiểm soát chặt chẽ, không để xảy ra các side effects ẩn.

### Pha 4: Đánh giá (Review)
Sau khi viết code:
1. Tự kiểm tra lại tính toàn vẹn của kiến trúc và tính an toàn kiểu dữ liệu (type safety).
2. Kiểm tra tính testable của logic mới viết.
3. Phát hiện sớm code smells phát sinh và loại bỏ trùng lặp code vừa tạo ra.

---

## FINAL VALIDATION CHECKLIST

Trước khi hoàn thành và bàn giao bất kỳ task nào, Agent bắt buộc phải tự tích chọn (verify) các điểm sau:

- [ ] **Yêu cầu đã được giải quyết triệt để?**
- [ ] **Kiến trúc hệ thống được bảo toàn nguyên vẹn?**
- [ ] **Không tạo ra trùng lặp code mới?**
- [ ] **Không đưa thêm các trừu tượng hóa thừa thãi (Overengineering)?**
- [ ] **Mọi kiểu dữ liệu được khai báo an toàn và chính xác (Type safety)?**
- [ ] **Độ đọc hiểu của code (Readability) được cải thiện tốt hơn trước?**
- [ ] **Chi phí bảo trì tương lai (Maintenance cost) được giảm thiểu tối đa?**

*Nếu bất kỳ tiêu chí nào ở trên không đạt, bắt buộc phải refactor lại mã nguồn trước khi kết thúc task.*
