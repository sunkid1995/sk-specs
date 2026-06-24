---
name: eslint-rules
description: Hướng dẫn viết code tuân thủ quy tắc ESLint của dự án để vượt qua bước kiểm tra validate và pre-commit. Kích hoạt bất cứ khi nào Agent viết hoặc sửa đổi các tệp mã nguồn (.ts, .tsx, .js, .jsx).
---

## QUY TẮC CÚ PHÁP & ĐỊNH DẠNG (FORMATTING)

### 1. Dấu chấm phẩy (Semicolons)
- **Bắt buộc**: Luôn luôn sử dụng dấu chấm phẩy `;` kết thúc câu lệnh trong các tệp TypeScript/JavaScript.
- Cấu hình: `@typescript-eslint/semi: ["error", "always"]`.

### 2. Dấu nháy (Quotes)
- **File TS/JS**: Sử dụng nháy đơn `'` cho các chuỗi thông thường. Cho phép tránh escape bằng cách dùng nháy kép hoặc backticks nếu chuỗi chứa nháy đơn.
  - *Ví dụ*: `const name = 'FPT Chat';`
- **File JSX/TSX (HTML props)**: Luôn luôn sử dụng nháy kép `"` cho các thuộc tính (props) JSX.
  - *Ví dụ*: `<input type="text" className="input" />`

### 3. Kiểu dữ liệu Any
- **Tuyệt đối cấm**: Không sử dụng kiểu `any` dưới mọi hình thức (eslint error `@typescript-eslint/no-explicit-any`).
- **Thay thế**: Sử dụng kiểu cụ thể hoặc dùng `unknown` và tiến hành narrow type khi xử lý.

### 4. Quy tắc import (No Restricted Imports)
- **Không import sâu**: Không được phép import trực tiếp sâu vào các thư mục con của `@/features/*/*`.
- **Thay thế**: Mọi import từ feature phải thông qua tệp barrel `index.ts` ở cấp thư mục feature (ví dụ: `import { SomeComponent } from '@/features/auth'`).

### 5. Khoảng trắng & Dòng trống (Spacing & Lines)
- **Dòng cuối file**: Luôn luôn có một dòng trống ở cuối tệp mã nguồn (`eol-last`).
- **Không có khoảng trắng thừa**: Tránh khoảng trắng thừa ở cuối dòng (`no-trailing-spaces`) và không được dùng nhiều khoảng trắng liên tiếp (`no-multi-spaces`).
- **Dòng trống liên tiếp**: Tối đa chỉ được phép có 1 dòng trống liên tiếp giữa các khối code (`no-multiple-empty-lines` max 1).
- **Cách đóng ngoặc JSX**: Ngoặc đóng của thẻ JSX phải thẳng hàng với thẻ mở của nó (`tag-aligned`).
- **Xuống dòng thuộc tính JSX**: Khi thẻ JSX có nhiều thuộc tính trên nhiều dòng, thuộc tính đầu tiên bắt buộc phải xuống dòng (`multiline`).
- **Độ thụt đầu dòng JSX**: Thụt đầu dòng JSX là **2 spaces** (`react/jsx-indent`).
- **Khoảng trắng Object**: Luôn có khoảng trắng ở cả hai phía trong dấu ngoặc nhọn của object `{ }`.
  - *Hợp lệ*: `const obj = { a: 1 };`
  - *Không hợp lệ*: `const obj = {a: 1};`
- **Khoảng trắng JSX curly**: Không được có khoảng trắng bên trong ngoặc nhọn `{}` của JSX prop/children.
  - *Hợp lệ*: `<Component prop={value} />`
  - *Không hợp lệ*: `<Component prop={ value } />`
- **Dấu bằng JSX**: Không có khoảng trắng xung quanh dấu `=` của thuộc tính JSX.
  - *Hợp lệ*: `name="value"`
  - *Không hợp lệ*: `name = "value"`
- **Khoảng trắng trước Block**: Luôn có khoảng trắng trước các khối ngoặc nhọn `{}` của hàm, điều kiện, vòng lặp.
  - *Ví dụ*: `if (condition) {` (có khoảng trắng trước `{`).

### 6. Khai báo không sử dụng (Unused Variables)
- **Cấm**: Không khai báo biến, tham số, import mà không sử dụng trong code (`@typescript-eslint/no-unused-vars`).
