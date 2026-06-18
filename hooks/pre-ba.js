#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function preBaHook() {
  const rootDir = process.cwd();
  console.log(`=== [PRE-BA HOOK] Khởi chạy kiểm tra trước BA: ${rootDir} ===\n`);

  const activeSpecsDir = path.join(rootDir, 'sk-specs', 'active');
  
  if (fs.existsSync(activeSpecsDir)) {
    const activeItems = fs.readdirSync(activeSpecsDir).filter(item => {
      const itemPath = path.join(activeSpecsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    if (activeItems.length > 0) {
      console.warn("⚠️  CẢNH BÁO: Hiện tại đang có các task khác cũng đang active trong dự án:");
      activeItems.forEach(item => {
        console.warn(`  * [Active Task] ${item}`);
      });
      console.warn("-> LƯU Ý: Vui lòng đối chiếu nghiệp vụ để tránh chồng chéo hoặc xung đột tính năng.\n");
    } else {
      console.log("✅ Không có task active song song nào khác.");
    }
  } else {
    console.log("ℹ️  Thư mục sk-specs/active/ chưa tồn tại. Đây có thể là task đầu tiên.");
  }

  console.log("\n=== [PRE-BA HOOK] Hoàn thành ===\n");
  process.exit(0);
}

preBaHook();
