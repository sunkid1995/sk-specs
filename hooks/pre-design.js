#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const taskName = process.argv[2];
console.log('=== Running pre-design Hook ===');

if (!taskName) {
  console.error('LỖI: Tên task không được truyền vào hook.');
  process.exit(1);
}

const taskDir = path.join(process.cwd(), 'sk-specs', taskName);

if (!fs.existsSync(taskDir)) {
  console.error(`LỖI: Thư mục task "${taskName}" không tồn tại tại sk-specs/. Vui lòng tạo thư mục task trước.`);
  process.exit(1);
}

try {
  const files = fs.readdirSync(taskDir);
  const analysisFile = files.find(f => f.startsWith('01-') && f.endsWith('.md'));

  if (!analysisFile) {
    console.error(`LỖI: Không tìm thấy tệp phân tích đầu tiên "01-*.md" (ví dụ: 01-feature-analysis.md) trong thư mục task "${taskName}".`);
    console.error('Yêu cầu phải hoàn thành giai đoạn phân tích (BA) và tạo tệp phân tích trước khi sang khâu thiết kế.');
    process.exit(1);
  }

  const analysisFilePath = path.join(taskDir, analysisFile);
  const content = fs.readFileSync(analysisFilePath, 'utf8');

  // Check for placeholders
  const placeholders = ['TODO', 'TBD', 'chưa xác định'];
  const foundPlaceholders = [];

  placeholders.forEach(ph => {
    if (content.toLowerCase().includes(ph.toLowerCase())) {
      foundPlaceholders.push(ph);
    }
  });

  if (foundPlaceholders.length > 0) {
    console.error(`LỖI: Tệp phân tích "${analysisFile}" vẫn chứa các từ khóa chưa hoàn thiện: ${foundPlaceholders.join(', ')}.`);
    console.error('Vui lòng bổ sung đầy đủ thông tin phân tích nghiệp vụ trước khi tiến hành thiết kế kỹ thuật.');
    process.exit(1);
  }

  console.log(`Xác thực thành công: Tệp phân tích "${analysisFile}" đã sẵn sàng.`);
  process.exit(0);
} catch (error) {
  console.error('Lỗi khi chạy pre-design hook:', error.message);
  process.exit(1);
}
