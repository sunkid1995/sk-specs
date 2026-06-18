#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function preReviewHook() {
  const rootDir = process.cwd();
  console.log(`=== [PRE-REVIEW HOOK] Kiểm tra điều kiện trước khi Code Review: ${rootDir} ===\n`);

  // Lấy tên work-item
  let workItem = process.argv[2];
  const activeSpecsDir = path.join(rootDir, 'sk-specs', 'active');

  if (!workItem && fs.existsSync(activeSpecsDir)) {
    const activeItems = fs.readdirSync(activeSpecsDir).filter(item => {
      const itemPath = path.join(activeSpecsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });
    
    if (activeItems.length > 0) {
      activeItems.sort((a, b) => {
        const statA = fs.statSync(path.join(activeSpecsDir, a));
        const statB = fs.statSync(path.join(activeSpecsDir, b));
        return statB.mtimeMs - statA.mtimeMs;
      });
      workItem = activeItems[0];
    }
  }

  if (!workItem) {
    console.error("❌ LỖI: Không tìm thấy task active nào để kiểm tra Code Review.");
    process.exit(1);
  }

  console.log(`Đang kiểm tra tiến trình của task: "${workItem}"...`);
  
  // 1. Kiểm tra progress.md
  const progressPath = path.join(activeSpecsDir, workItem, 'progress.md');
  if (fs.existsSync(progressPath)) {
    const progressContent = fs.readFileSync(progressPath, 'utf8');
    
    // Tìm các task chưa hoàn thành: "[ ]" hoặc "[/]"
    const unfinishedTasks = [];
    const lines = progressContent.split('\n');
    lines.forEach(line => {
      if (line.includes('- [ ]') || line.includes('- [/]')) {
        unfinishedTasks.push(line.trim());
      }
    });

    if (unfinishedTasks.length > 0) {
      console.warn(`⚠️  CẢNH BÁO: Phát hiện các task chưa hoàn thành trong 'progress.md':`);
      unfinishedTasks.forEach(task => console.warn(`  * ${task}`));
      console.warn("-> GỢI Ý: Vui lòng cập nhật và hoàn thành toàn bộ các checklist trong progress.md.");
    } else {
      console.log("✅ Tất cả các checklist trong progress.md đã được đánh dấu hoàn thành [x].");
    }
  } else {
    console.warn(`⚠️  Cảnh báo: Không tìm thấy tệp 'progress.md' tại ${progressPath}. Bỏ qua kiểm tra checklist.`);
  }

  // 2. Kiểm tra Git diff (đảm bảo có code thay đổi để review)
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (!gitStatus) {
      console.error("❌ LỖI RÀNG BUỘC: Không phát hiện thấy bất kỳ file nào thay đổi trong Git (Git working tree sạch).");
      console.error("-> YÊU CẦU: Bạn phải có mã nguồn được chỉnh sửa/thêm mới thì mới có thể tiến hành Code Review.");
      process.exit(1);
    } else {
      console.log("✅ Phát hiện các file có thay đổi trong Git sẵn sàng để review:");
      const modifiedFiles = gitStatus.split('\n').slice(0, 5);
      modifiedFiles.forEach(file => console.log(`  * ${file}`));
      if (gitStatus.split('\n').length > 5) {
        console.log(`  ... và ${gitStatus.split('\n').length - 5} tệp tin khác.`);
      }
    }
  } catch (error) {
    console.warn("⚠️  Cảnh báo: Không thể chạy lệnh Git. Có thể dự án chưa được khởi tạo Git. Bỏ qua kiểm tra Git status.");
  }

  console.log("\n=== [PRE-REVIEW HOOK] Hoàn thành ===\n");
  process.exit(0);
}

preReviewHook();
