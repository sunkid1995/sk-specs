#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const taskName = process.argv[2];
console.log('=== Running pre-review Hook ===');

if (!taskName) {
  console.error('LỖI: Tên task không được truyền vào hook.');
  process.exit(1);
}

const taskDir = path.join(process.cwd(), 'sk-specs', taskName);

if (!fs.existsSync(taskDir)) {
  console.error(`LỖI: Thư mục task "${taskName}" không tồn tại tại sk-specs/.`);
  process.exit(1);
}

try {
  // 1. Kiểm tra Git diff trên toàn bộ repository (nới lỏng điều kiện)
  const rawDiff = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  const gitDiff = rawDiff
    .split('\n')
    .map(line => line.slice(3).trim())
    .filter(file => file !== '' && !file.includes('.DS_Store') && !file.endsWith('.log'))
    .join('\n');
  
  if (!gitDiff) {
    console.error('\x1b[31m%s\x1b[0m', 'LỖI: Không phát hiện bất kỳ thay đổi nào trong repository.');
    console.error('Bạn không thể tiến hành Code Review khi chưa thực hiện bất cứ sửa đổi nào.');
    process.exit(1);
  }

  // 2. Kiểm tra sự tồn tại đầy đủ của tài liệu đặc tả
  const files = fs.readdirSync(taskDir);
  const requiredPrefixes = ['01-', '02-', '03-'];
  const missingPrefixes = [];

  requiredPrefixes.forEach(prefix => {
    const found = files.find(f => f.startsWith(prefix) && f.endsWith('.md'));
    if (!found) {
      missingPrefixes.push(prefix);
    }
  });

  if (missingPrefixes.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', `LỖI: Thư mục task "${taskName}" thiếu tài liệu đặc tả bắt đầu bằng: ${missingPrefixes.join(', ')}`);
    console.error('Yêu cầu phải có đầy đủ 01-*.md (BA), 02-*.md (Architecture), 03-*.md (Task Breakdown) trước khi review.');
    process.exit(1);
  }

  console.log('Xác thực trước Code Review thành công: Git diff hợp lệ và tài liệu đặc tả đầy đủ.');
  process.exit(0);
} catch (error) {
  console.error('Lỗi khi chạy pre-review hook:', error.message);
  process.exit(1);
}
