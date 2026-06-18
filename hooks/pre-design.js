#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function preDesignHook() {
  const rootDir = process.cwd();
  console.log(`=== [PRE-DESIGN HOOK] Kiểm tra tài liệu BA trước khi Thiết kế: ${rootDir} ===\n`);

  // Lấy tên work-item được truyền qua đối số, hoặc tìm trong sk-specs/active/
  let workItem = process.argv[2];
  const activeSpecsDir = path.join(rootDir, 'sk-specs', 'active');

  if (!workItem && fs.existsSync(activeSpecsDir)) {
    const activeItems = fs.readdirSync(activeSpecsDir).filter(item => {
      const itemPath = path.join(activeSpecsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });
    
    if (activeItems.length === 1) {
      workItem = activeItems[0];
    } else if (activeItems.length > 1) {
      console.warn(`⚠️  Phát hiện nhiều hơn 1 task active. Đang tự chọn task mới nhất.`);
      // Sắp xếp theo thời gian chỉnh sửa mới nhất
      activeItems.sort((a, b) => {
        const statA = fs.statSync(path.join(activeSpecsDir, a));
        const statB = fs.statSync(path.join(activeSpecsDir, b));
        return statB.mtimeMs - statA.mtimeMs;
      });
      workItem = activeItems[0];
    }
  }

  if (!workItem) {
    console.error("❌ LỖI: Không tìm thấy task active nào để kiểm tra thiết kế.");
    console.error("-> YÊU CẦU: Vui lòng khởi tạo quy trình bằng cách chạy lệnh slash command tương ứng (ví dụ: /sk-ba).");
    process.exit(1);
  }

  console.log(`Đang kiểm tra tài liệu BA cho task: "${workItem}"...`);
  const baPath = path.join(activeSpecsDir, workItem, 'ba.md');

  if (!fs.existsSync(baPath)) {
    console.error(`❌ LỖI RÀNG BUỘC: Không tìm thấy tệp đặc tả nghiệp vụ 'ba.md' tại đường dẫn:`);
    console.error(`   ${baPath}`);
    console.error(`-> BẮT BUỘC: Bạn phải hoàn thành giai đoạn Phân tích Nghiệp vụ (BA) và được duyệt 'ba.md' trước khi Thiết kế.`);
    process.exit(1);
  }

  // Đọc và quét tìm placeholder chưa điền
  const baContent = fs.readFileSync(baPath, 'utf8');
  const placeholders = ['TODO', 'TBD', '<chờ cung cấp>', 'placeholder'];
  const foundPlaceholders = [];

  placeholders.forEach(ph => {
    if (baContent.toLowerCase().includes(ph.toLowerCase())) {
      foundPlaceholders.push(ph);
    }
  });

  if (foundPlaceholders.length > 0) {
    console.warn(`⚠️  CẢNH BÁO: Phát hiện các ký tự đánh dấu placeholder chưa hoàn thiện trong 'ba.md': ${foundPlaceholders.join(', ')}`);
    console.warn("-> ĐỀ XUẤT: Hãy đảm bảo các câu hỏi và nghiệp vụ mập mờ đã được giải quyết triệt để trước khi bắt đầu thiết kế kỹ thuật.");
  } else {
    console.log("✅ Tài liệu ba.md hợp lệ và đã sẵn sàng cho giai đoạn Thiết kế kỹ thuật.");
  }

  console.log("\n=== [PRE-DESIGN HOOK] Hoàn thành ===\n");
  process.exit(0);
}

preDesignHook();
