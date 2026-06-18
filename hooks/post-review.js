#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function postReviewHook() {
  const rootDir = process.cwd();
  console.log(`=== [POST-REVIEW HOOK] Kiểm tra điều kiện chuyển trạng thái spec: ${rootDir} ===\n`);

  // Lấy tên work-item
  let workItem = process.argv[2];
  const activeSpecsDir = path.join(rootDir, 'sk-specs', 'active');
  const completedSpecsDir = path.join(rootDir, 'sk-specs', 'completed');

  if (!workItem && fs.existsSync(activeSpecsDir)) {
    const activeItems = fs.readdirSync(activeSpecsDir).filter(item => {
      const itemPath = path.join(activeSpecsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    if (activeItems.length > 0) {
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
    console.log("ℹ️  Không tìm thấy task active nào. Bỏ qua kiểm tra chuyển trạng thái.");
    process.exit(0);
  }

  const workItemDir = path.join(activeSpecsDir, workItem);
  console.log(`Đang kiểm tra điều kiện hoàn thành cho task: "${workItem}"...`);

  // Điều kiện 1: Kiểm tra review.md đã tồn tại
  const reviewPath = path.join(workItemDir, 'review.md');
  const hasReview = fs.existsSync(reviewPath);
  if (!hasReview) {
    console.log("⚠️  Chưa tìm thấy tệp review.md. Task chưa đủ điều kiện chuyển sang completed/.");
    console.log("\n=== [POST-REVIEW HOOK] Hoàn thành (không chuyển trạng thái) ===\n");
    process.exit(0);
  }
  console.log("✅ Tệp review.md đã tồn tại.");

  // Điều kiện 2: Kiểm tra progress.md có trạng thái Completed
  const progressPath = path.join(workItemDir, 'progress.md');
  let isCompleted = false;
  if (fs.existsSync(progressPath)) {
    const progressContent = fs.readFileSync(progressPath, 'utf8');
    // Tìm dòng chứa trạng thái tổng (Completed / In Progress / ...)
    isCompleted = progressContent.toLowerCase().includes('completed');

    // Kiểm tra thêm: không còn task chưa hoàn thành
    const unfinishedTasks = progressContent.split('\n').filter(line =>
      line.includes('- [ ]') || line.includes('- [/]')
    );

    if (unfinishedTasks.length > 0) {
      console.log(`⚠️  Vẫn còn ${unfinishedTasks.length} task chưa hoàn thành trong progress.md.`);
      isCompleted = false;
    }
  }

  if (!isCompleted) {
    console.log("⚠️  Trạng thái trong progress.md chưa đạt 'Completed' hoặc vẫn còn task chưa xong.");
    console.log("-> GỢI Ý: Cập nhật trạng thái trong progress.md thành 'Completed' và đánh dấu tất cả task [x] nếu đã hoàn thành.");
    console.log("\n=== [POST-REVIEW HOOK] Hoàn thành (không chuyển trạng thái) ===\n");
    process.exit(0);
  }
  console.log("✅ Trạng thái progress.md: Completed.");

  // Cả 2 điều kiện đạt → Di chuyển từ active/ sang completed/
  const targetDir = path.join(completedSpecsDir, workItem);
  try {
    fs.mkdirSync(completedSpecsDir, { recursive: true });

    // Nếu thư mục đích đã tồn tại (task cùng tên trước đó), tạo suffix timestamp
    let finalTargetDir = targetDir;
    if (fs.existsSync(targetDir)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      finalTargetDir = `${targetDir}-${timestamp}`;
    }

    fs.renameSync(workItemDir, finalTargetDir);
    console.log(`\n🎉 ĐÃ CHUYỂN TRẠNG THÁI THÀNH CÔNG!`);
    console.log(`   Từ: sk-specs/active/${workItem}/`);
    console.log(`   Đến: sk-specs/completed/${path.basename(finalTargetDir)}/`);
  } catch (error) {
    console.error(`❌ Lỗi khi di chuyển thư mục spec: ${error.message}`);
    console.error("-> Vui lòng di chuyển thủ công hoặc kiểm tra quyền truy cập thư mục.");
    process.exit(1);
  }

  console.log("\n=== [POST-REVIEW HOOK] Hoàn thành ===\n");
  process.exit(0);
}

postReviewHook();
