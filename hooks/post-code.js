#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function runCommand(command) {
  try {
    console.log(`Đang chạy lệnh: ${command}...`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Lệnh thất bại: ${command}`);
    return false;
  }
}

function postCodeHook() {
  const rootDir = process.cwd();
  console.log(`=== [POST-CODE HOOK] Bắt đầu kiểm tra sau khi lập trình: ${rootDir} ===\n`);

  const packageJsonPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.warn("⚠️  Không tìm thấy package.json. Bỏ qua chạy kiểm thử.");
    process.exit(0);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};

  let testsPassed = true;
  let lintPassed = true;

  // 1. Chạy lint
  if (scripts.lint) {
    console.log("--- Bắt đầu chạy Linter ---");
    lintPassed = runCommand('npm run lint');
  } else {
    console.log("ℹ️  Không tìm thấy script 'lint' trong package.json. Bỏ qua chạy lint.");
  }

  // 2. Chạy test
  if (scripts.test) {
    console.log("\n--- Bắt đầu chạy Tests ---");
    testsPassed = runCommand('npm run test -- --watch=false --run');
  } else if (fs.existsSync(path.join(rootDir, 'node_modules', 'vitest'))) {
    console.log("\n--- Bắt đầu chạy Vitest trực tiếp ---");
    testsPassed = runCommand('npx vitest run');
  } else {
    console.log("ℹ️  Không tìm thấy script 'test' hay Vitest. Bỏ qua chạy kiểm thử.");
  }

  console.log("\n=== TỔNG HỢP KẾT QUẢ KIỂM TRA ===");
  console.log(`- Linter: ${lintPassed ? '✅ ĐẠT' : '❌ THẤT BẠI'}`);
  console.log(`- Kiểm thử (Tests): ${testsPassed ? '✅ ĐẠT' : '❌ THẤT BẠI'}`);
  console.log("=================================\n");

  if (!testsPassed || !lintPassed) {
    console.error("❌ HOOK THẤT BẠI: Một số kiểm tra chất lượng code hoặc unit test không vượt qua!");
    console.error("-> YÊU CẦU: Vui lòng sửa lại các lỗi trên trước khi chuyển sang bước Code Review.");
    process.exit(1); // Exit 1 để ngăn chặn chuyển giai đoạn
  }

  console.log("✅ HOOK THÀNH CÔNG: Mọi bài kiểm tra chất lượng code và unit test đều vượt qua!");
  console.log("\n=== [POST-CODE HOOK] Hoàn thành ===\n");
  process.exit(0);
}

postCodeHook();
