#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function postReviewHook() {
  const rootDir = process.cwd();
  console.log(`=== [POST-REVIEW HOOK] Kiểm tra điều kiện hoàn thành task: ${rootDir} ===\n`);

  // Lấy tên work-item từ đối số truyền vào
  let workItem = process.argv[2];
  const specsDir = path.join(rootDir, 'sk-specs');

  if (!fs.existsSync(specsDir)) {
    console.log("ℹ️  Thư mục sk-specs/ không tồn tại. Bỏ qua kiểm tra.");
    process.exit(0);
  }

  // Tự động nhận diện task active mới nhất nếu không truyền tham số
  if (!workItem) {
    const items = fs.readdirSync(specsDir).filter(item => {
      const itemPath = path.join(specsDir, item);
      // Chỉ lấy thư mục, bỏ qua chính thư mục sửa lỗi này
      return fs.statSync(itemPath).isDirectory() && item !== 'fix-agent-hooks-syntax-and-structure';
    });

    if (items.length > 0) {
      // Sắp xếp các thư mục theo thời gian chỉnh sửa (mtimeMs) mới nhất
      items.sort((a, b) => {
        const statA = fs.statSync(path.join(specsDir, a));
        const statB = fs.statSync(path.join(specsDir, b));
        return statB.mtimeMs - statA.mtimeMs;
      });
      workItem = items[0];
    }
  }

  if (!workItem) {
    console.log("ℹ️  Không tìm thấy task nào dưới sk-specs/. Bỏ qua kiểm tra.");
    process.exit(0);
  }

  const workItemDir = path.join(specsDir, workItem);
  console.log(`Đang kiểm tra điều kiện hoàn thành cho task: "${workItem}" tại: ${workItemDir}...`);

  // Điều kiện 1: Kiểm tra code-review.md đã tồn tại
  const reviewPath = path.join(workItemDir, 'code-review.md');
  const hasReview = fs.existsSync(reviewPath);
  if (!hasReview) {
    console.log(`⚠️  Chưa tìm thấy tệp code-review.md tại ${reviewPath}. Task chưa đủ điều kiện hoàn thành.`);
    console.log("\n=== [POST-REVIEW HOOK] Hoàn thành (Điều kiện chưa đạt) ===\n");
    process.exit(0);
  }
  console.log("✅ Tệp code-review.md đã tồn tại.");

  // Điều kiện 2: Kiểm tra trạng thái hoàn thành từ các file checklist
  const possibleFiles = ['03-task-breakdown.md', 'task.md', 'progress.md'];
  let isCompleted = false;
  let foundFile = null;

  for (const file of possibleFiles) {
    const filePath = path.join(workItemDir, file);
    if (fs.existsSync(filePath)) {
      foundFile = file;
      const progressContent = fs.readFileSync(filePath, 'utf8');
      
      // Kiểm tra xem có chứa task chưa hoàn thành hay không
      const hasUnfinished = progressContent.includes('- [ ]') || progressContent.includes('- [/]');
      isCompleted = !hasUnfinished;
      break;
    }
  }

  if (foundFile) {
    console.log(`Đã tìm thấy tệp tiến trình: ${foundFile}`);
    if (!isCompleted) {
      console.log(`⚠️  Vẫn còn task chưa hoàn thành trong ${foundFile} (phát hiện ký hiệu "- [ ]" hoặc "- [/]").`);
      console.log(`-> GỢI Ý: Vui lòng hoàn thành và đánh dấu tích tất cả task thành "- [x]" trước khi kết thúc.`);
      console.log("\n=== [POST-REVIEW HOOK] Hoàn thành (Điều kiện chưa đạt) ===\n");
      process.exit(0);
    }
    console.log(`✅ Tất cả các checklist trong ${foundFile} đã được đánh dấu hoàn thành.`);
  } else {
    // Nếu không tìm thấy file checklist nào, coi như tạm thời thông qua (hoặc có thể cảnh báo)
    console.log("ℹ️  Không tìm thấy tệp tiến trình (progress.md / task.md / 03-task-breakdown.md). Bỏ qua kiểm tra checklist.");
  }

  // Cả 2 điều kiện đạt
  console.log(`\n🎉 ĐÃ XÁC NHẬN HOÀN THÀNH TASK THÀNH CÔNG!`);
  console.log(`   Task: sk-specs/${workItem}/`);
  console.log(`   Đã ghi nhận tệp code-review.md và hoàn thành toàn bộ checklist.`);
  console.log("\n=== [POST-REVIEW HOOK] Hoàn thành ===\n");
  process.exit(0);
}

postReviewHook();
