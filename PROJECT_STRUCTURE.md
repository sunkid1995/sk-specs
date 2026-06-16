# Cấu Trúc Dự Án và Đặc Tả Chi Tiết

Tài liệu này đặc tả chi tiết nhiệm vụ và chức năng của từng thư mục, từng file cấu hình cấu trúc AI Agent trong repository `sk-specs`.

---

## 1. Thư mục rules/
Chứa các quy định, ràng buộc kỹ thuật bắt buộc và hướng dẫn hành vi phản hồi của AI Agent. Tất cả các rule trong thư mục này đều có tính bắt buộc cao nhất.

*   [architecture-rules.md](rules/architecture-rules.md)
    *   **Nhiệm vụ:** Định nghĩa kiến trúc Frontend của ứng dụng.
    *   **Tính năng:** Quy định tách biệt các Concern (UI, State, Persistence, Domain); cách tổ chức modular cho Zustand Store, Storage Wrapper và các yêu cầu mở rộng kiến trúc trong tương lai (multi-tab, server sync).
*   [core-rules.md](rules/core-rules.md)
    *   **Nhiệm vụ:** Khai báo vai trò cốt lõi, thứ tự ưu tiên kỹ thuật và quy chuẩn phản hồi của Agent.
    *   **Tính năng:** Quy định Agent đi thẳng vào vấn đề, ưu tiên tái sử dụng code/tiện ích sẵn có; quy định bắt buộc phân tích BA trước khi triển khai Feature, và bắt buộc tìm/tạo BA cũ và test case cũ đối với Refactor/Bugfix.
*   [folder-structure-and-export-rules.md](rules/folder-structure-and-export-rules.md)
    *   **Nhiệm vụ:** Kiểm soát cấu trúc thư mục dự án và cách thức export module.
    *   **Tính năng:** Bắt buộc thiết kế "Folder-first" (mỗi module phải nằm trong một folder riêng); quy định đặt tên folder theo kiểu `kebab-case`; bắt buộc sử dụng `export default` cho tất cả Component và Hook để giữ tính nhất quán.
*   [import-rule.md](rules/import-rule.md)
    *   **Nhiệm vụ:** Chuẩn hóa cách thức import thư viện và file trong mã nguồn.
    *   **Tính năng:** Định nghĩa thứ tự ưu tiên của các block import (React, 3rd party, commons, hooks, v.v.); quy định định dạng block comment và sắp xếp các import member theo thứ tự Alphabetical (A-Z).
*   [output-format.md](rules/output-format.md)
    *   **Nhiệm vụ:** Định nghĩa cấu trúc định dạng đầu ra của các tài liệu đặc tả kỹ thuật.
    *   **Tính năng:** Quy định chi tiết các đề mục cần có khi Agent phân tích tính năng (Feature Analysis), thiết kế kiến trúc (Architecture Design), và phân rã công việc (Task Breakdown).
*   [security-rules.md](rules/security-rules.md)
    *   **Nhiệm vụ:** Ràng buộc các tiêu chuẩn bảo mật tối thiểu cho mã nguồn Frontend.
    *   **Tính năng:** Cấm hardcode API keys/secrets (buộc dùng `.env`); bắt buộc lọc dữ liệu HTML qua DOMPurify trước khi render (phòng chống XSS); quy định bảo mật dữ liệu nhạy cảm lưu trữ ở Client-side.
*   [slash-commands.md](rules/slash-commands.md)
    *   **Nhiệm vụ:** Định nghĩa danh sách và hành vi phản hồi của Agent đối với các lệnh gõ tắt bắt đầu bằng dấu gạch chéo (`/`).
    *   **Tính năng:** Hỗ trợ kích hoạt trực tiếp các workflow và checkpoint (như `/ba`, `/feature`, `/bugfix`, `/refactor`, `/review`, `/continue`, `/sync`), tối giản hóa quá trình tương tác.
*   [spec-loading.md](rules/spec-loading.md)
    *   **Nhiệm vụ:** Điều phối hành vi tải (load) ngữ cảnh đặc tả kỹ thuật hiện tại.
    *   **Tính năng:** Bắt buộc Agent tìm kiếm và tái sử dụng các quyết định, cấu trúc spec có sẵn trong `.agents/sk-specs/` để duy trì tính liên tục (Context Continuity) và tránh xung đột.
*   [spec-persistence.md](rules/spec-persistence.md)
    *   **Nhiệm vụ:** Điều phối hành vi ghi (lưu trữ) các đặc tả kỹ thuật.
    *   **Tính năng:** Tự động lưu trữ đầu ra của Feature/Bug/Refactor vào thư mục `.agents/sk-specs/<work-item-name>/`; quy định cấu trúc file spec chuẩn và yêu cầu tối thiểu số lượng test cases.
*   [testing-rules.md](rules/testing-rules.md)
    *   **Nhiệm vụ:** Ràng buộc môi trường và tiêu chuẩn kiểm thử.
    *   **Tính năng:** Chỉ định sử dụng Vitest và React Testing Library; yêu cầu file test đặt cạnh file code chính (colocated); bắt buộc độ bao phủ kiểm thử (coverage) phải đạt tối thiểu 80%.

---

## 2. Thư mục skills/
Chứa các tài liệu hướng dẫn kỹ năng chuyên môn, mẫu thiết kế (design patterns) và kinh nghiệm thực tiễn giúp AI Agent giải quyết tối ưu các bài toán kỹ thuật cụ thể. Mỗi skill được tổ chức thành một folder riêng chứa file `SKILL.md` theo tiêu chuẩn Antigravity IDE.

*   [business-analysis/SKILL.md](skills/business-analysis/SKILL.md)
    *   **Nhiệm vụ:** Kỹ năng phân tích nghiệp vụ.
    *   **Tính năng:** Hướng dẫn Agent cách xác định mục tiêu kinh doanh, đối tượng sử dụng, rủi ro, giả định và các trường hợp biên trước khi bắt đầu code.
*   [code-review-principles/SKILL.md](skills/code-review-principles/SKILL.md)
    *   **Nhiệm vụ:** Hướng dẫn các tiêu chí đánh giá chất lượng khi tiến hành Review Code.
    *   **Tính năng:** Quy định thứ tự ưu tiên của việc đánh giá (1. Nghiệp vụ, 2. Tiêu chí chấp nhận, 3. Kiến trúc, 4. Chất lượng code); cấm Agent tự động refactor hoặc viết lại code của người dùng trừ khi có yêu cầu.
*   [debugging-patterns/SKILL.md](skills/debugging-patterns/SKILL.md)
    *   **Nhiệm vụ:** Cung cấp phương pháp luận và các bước điều tra lỗi.
    *   **Tính năng:** Hướng dẫn cách cô lập hành vi lỗi, thu thập log, xác định chính xác vị trí lỗi thay vì chỉ phỏng đoán.
*   [feature-analysis/SKILL.md](skills/feature-analysis/SKILL.md)
    *   **Nhiệm vụ:** Kỹ năng phân tích một yêu cầu tính năng lớn.
    *   **Tính năng:** Hướng dẫn bóc tách yêu cầu, phân tích sự tương tác giữa các mô-đun và lập kế hoạch triển khai.
*   [frontend-stack/SKILL.md](skills/frontend-stack/SKILL.md)
    *   **Nhiệm vụ:** Cung cấp bối cảnh về hệ thống công nghệ Frontend sử dụng trong dự án.
    *   **Tính năng:** Chuẩn hóa các công nghệ: TypeScript, React, Zustand, TailwindCSS, SCSS, Vitest để Agent tuân thủ.
*   [performance-optimization/SKILL.md](skills/performance-optimization/SKILL.md)
    *   **Nhiệm vụ:** Hướng dẫn các kỹ thuật tối ưu hóa hiệu năng hệ thống.
    *   **Tính năng:** Kỹ thuật sử dụng Zustand Selectors tránh render thừa; lazy-loading các component/modal nặng; quản lý thư viện thứ 3 hỗ trợ tree-shaking (lodash-es); tối ưu hóa assets (WebP, SVG) và React render.
*   [react-zustand-patterns/SKILL.md](skills/react-zustand-patterns/SKILL.md)
    *   **Nhiệm vụ:** Hướng dẫn thiết kế State Layer trong React kết hợp Zustand.
    *   **Tính năng:** Hướng dẫn phân tách store theo feature; kỹ thuật thiết kế state (persistent state, transient state, derived state); quy tắc hydration an toàn.
*   [refactor-principles/SKILL.md](skills/refactor-principles/SKILL.md)
    *   **Nhiệm vụ:** Cung cấp nguyên lý tái cấu trúc code an toàn.
    *   **Tính năng:** Hướng dẫn chia nhỏ các bước refactor, đảm bảo chức năng cũ không bị thay đổi và không tạo ra side-effects.
*   [regression-safety/SKILL.md](skills/regression-safety/SKILL.md)
    *   **Nhiệm vụ:** Hướng dẫn kiểm soát và phòng ngừa lỗi hồi quy (regression).
    *   **Tính năng:** Cách lập danh sách kiểm thử hồi quy dựa trên các mô-đun bị ảnh hưởng gián tiếp từ sự thay đổi.
*   [reviewing-code/SKILL.md](skills/reviewing-code/SKILL.md)
    *   **Nhiệm vụ:** Quy định tự rà soát (self-review) code của Agent trước khi hoàn thành task.
    *   **Tính năng:** Checklist tự đánh giá các khía cạnh correctness, architecture, maintainability đối với code do chính Agent tạo ra.
*   [vietnamese-assistant/SKILL.md](skills/vietnamese-assistant/SKILL.md)
    *   **Nhiệm vụ:** Chuẩn hóa ngôn ngữ giao tiếp của Agent với người dùng.
    *   **Tính năng:** Hướng dẫn sử dụng Tiếng Việt tự nhiên, lịch sự, ngắn gọn và định dạng markdown chuẩn trong quá trình giải thích.

---

## 3. Thư mục workflows/
Định nghĩa quy trình thực thi chi tiết theo từng bước đối với các loại nhiệm vụ khác nhau để đảm bảo kết quả đầu ra luôn nhất quán.

*   [business-analysis.md](workflows/business-analysis.md)
    *   **Nhiệm vụ:** Quy trình thực hiện phân tích nghiệp vụ.
    *   **Tính năng:** Quy định định dạng và các mục bắt buộc trong file đặc tả nghiệp vụ `ba.md`.
*   [code-review.md](workflows/code-review.md)
    *   **Nhiệm vụ:** Quy trình tiến hành Code Review.
    *   **Tính năng:** Các bước đối chiếu yêu cầu, kiểm tra kiến trúc và ghi nhận phản hồi trong file `review.md`.
*   [feature-analysis.md](workflows/feature-analysis.md)
    *   **Nhiệm vụ:** Quy trình phân tích tính năng mới.
    *   **Tính năng:** Hướng dẫn đi từ đặc tả BA sang các cấu trúc chức năng chi tiết trong file `feature.md`.
*   [feature-architecture.md](workflows/feature-architecture.md)
    *   **Nhiệm vụ:** Quy trình thiết kế kiến trúc cho tính năng.
    *   **Tính năng:** Hướng dẫn thiết kế sơ đồ thư mục, luồng dữ liệu và kiểu dữ liệu.
*   [feature-task-breakdown.md](workflows/feature-task-breakdown.md)
    *   **Nhiệm vụ:** Quy trình phân rã task triển khai.
    *   **Tính năng:** Hướng dẫn chia nhỏ công việc thành các sub-task độc lập để giảm thiểu kích thước context.
*   [fix-bug.md](workflows/fix-bug.md)
    *   **Nhiệm vụ:** Quy trình sửa lỗi phần mềm.
    *   **Tính năng:** Quy định định dạng file `fix-bug.md`, yêu cầu viết test case tái hiện lỗi trước khi sửa và bắt buộc tối thiểu 10 validation test cases.
*   [legacy-cleanup.md](workflows/legacy-cleanup.md)
    *   **Nhiệm vụ:** Quy trình dọn dẹp mã nguồn cũ và code thừa.
    *   **Tính năng:** Các bước ánh xạ phụ thuộc, lập kế hoạch dọn dẹp, kiểm soát rủi ro hồi quy và bắt buộc tối thiểu 10 regression test cases.
*   [root-cause-analysis.md](workflows/root-cause-analysis.md)
    *   **Nhiệm vụ:** Quy trình phân tích nguyên nhân gốc rễ lỗi hệ thống phức tạp.
    *   **Tính năng:** Hướng dẫn phân tích 5 Whys, đưa ra giải pháp khắc phục ngắn hạn/dài hạn, biện pháp ngăn ngừa và tối thiểu 5 test cases.
*   [safe-refactor.md](workflows/safe-refactor.md)
    *   **Nhiệm vụ:** Quy trình tái cấu trúc code an toàn.
    *   **Tính năng:** Quy định cấu trúc file `refactor.md`, yêu cầu chạy lại và xác nhận các test case cũ trước khi refactor, đánh giá rủi ro hồi quy và bắt buộc tối thiểu 10 regression test cases.
*   [testing-workflow.md](workflows/testing-workflow.md)
    *   **Nhiệm vụ:** Quy trình xây dựng kịch bản và thực thi kiểm thử.
    *   **Tính năng:** Các bước từ phân tích kịch bản kiểm thử (test scenarios), viết test logic/UI, chạy debug đến kiểm tra báo cáo coverage.

---

## 4. Các file khác ở thư mục gốc
*   [README.md](README.md)
    *   **Nhiệm vụ:** Tài liệu giới thiệu và hướng dẫn tổng quan của dự án.
    *   **Tính năng:** Mô tả cấu trúc phân lớp AI Agent, tầm nhìn kiến trúc dài hạn, cách hoạt động của cơ chế lưu trữ đặc tả (`spec-persistence`) và cơ chế tải đặc tả (`spec-loading`).

---

## 5. Thư mục commands/
Chứa các Custom Slash Commands tương thích với cơ chế nhận diện của Antigravity IDE. Mỗi command được tổ chức dưới dạng một folder chứa file `SKILL.md` theo chuẩn Antigravity IDE. Khi đồng bộ sang client project, toàn bộ thư mục này sẽ được sao chép trực tiếp vào `.agents/skills/` của client để IDE quét và hiển thị thành phím tắt lệnh gõ nhanh bắt đầu bằng dấu `/`.

*   [ba/SKILL.md](commands/ba/SKILL.md)
    *   **Nhiệm vụ:** Custom Slash Command `/ba`. Kích hoạt Business Analysis workflow và sinh `ba.md`.
*   [feature/SKILL.md](commands/feature/SKILL.md)
    *   **Nhiệm vụ:** Custom Slash Command `/feature`. Kích hoạt Feature workflow và sinh `feature.md`.
*   [bugfix/SKILL.md](commands/bugfix/SKILL.md)
    *   **Nhiệm vụ:** Custom Slash Command `/bugfix`. Kích hoạt Bugfix workflow và sinh `fix-bug.md`.
*   [refactor/SKILL.md](commands/refactor/SKILL.md)
    *   **Nhiệm vụ:** Custom Slash Command `/refactor`. Kích hoạt Safe Refactor workflow và sinh `refactor.md`.
*   [review/SKILL.md](commands/review/SKILL.md)
    *   **Nhiệm vụ:** Custom Slash Command `/review`. Kích hoạt Code Review và sinh `review.md`.
*   [continue/SKILL.md](commands/continue/SKILL.md)
    *   **Nhiệm vụ:** Custom Slash Command `/continue`. Tiếp tục tiến trình công việc dang dở.
