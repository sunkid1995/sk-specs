#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.agents',
  'sk-specs',
  'coverage',
  '.cache'
]);

const IGNORED_FILES = new Set([
  '.DS_Store',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'tailwind.config.js'
]);

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!IGNORED_DIRS.has(file)) {
        walkDir(filePath, fileList);
      }
    } else {
      if (!IGNORED_FILES.has(file)) {
        fileList.push({
          path: filePath,
          name: file,
          dir: dir,
          base: path.basename(filePath, path.extname(filePath))
        });
      }
    }
  }
  return fileList;
}

function analyzeWorkspace() {
  const rootDir = process.cwd();
  console.log(`=== [PRE-CODE HOOK] Bắt đầu quét không gian làm việc: ${rootDir} ===\n`);

  const files = walkDir(rootDir);
  const components = [];
  const hooks = [];
  const stores = [];
  const utils = [];
  const allModules = {};

  // Phân loại các file và thư mục
  files.forEach(file => {
    const relativePath = path.relative(rootDir, file.path);
    const parts = relativePath.split(path.sep);
    
    // Thu thập các folder component, hook, store
    const name = file.base;
    
    if (parts.includes('components')) {
      const compDir = parts.slice(0, parts.indexOf('components') + 2).join('/');
      if (!components.includes(compDir) && compDir !== '') {
        components.push(compDir);
        const baseDir = path.basename(compDir);
        if (!allModules[baseDir]) allModules[baseDir] = [];
        allModules[baseDir].push({ type: 'Component', path: compDir });
      }
    } else if (parts.includes('hooks')) {
      const hookDir = parts.slice(0, parts.indexOf('hooks') + 2).join('/');
      if (!hooks.includes(hookDir) && hookDir !== '') {
        hooks.push(hookDir);
        const baseDir = path.basename(hookDir);
        if (!allModules[baseDir]) allModules[baseDir] = [];
        allModules[baseDir].push({ type: 'Hook', path: hookDir });
      }
    } else if (parts.includes('stores')) {
      const storeDir = parts.slice(0, parts.indexOf('stores') + 2).join('/');
      if (!stores.includes(storeDir) && storeDir !== '') {
        stores.push(storeDir);
        const baseDir = path.basename(storeDir);
        if (!allModules[baseDir]) allModules[baseDir] = [];
        allModules[baseDir].push({ type: 'Store', path: storeDir });
      }
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
      if (parts.includes('lib') || parts.includes('utils') || parts.includes('helpers')) {
        utils.push(relativePath);
        if (!allModules[name]) allModules[name] = [];
        allModules[name].push({ type: 'Utility/Helper', path: relativePath });
      }
    }
  });

  // Liệt kê tài sản hiện có cho AI Agent
  console.log("--- DANH SÁCH TÀI NGUYÊN HIỆN CÓ ---");
  console.log(`- Components (${components.length}):`);
  components.forEach(c => console.log(`  * [Component] ${c}`));
  console.log(`- Hooks (${hooks.length}):`);
  hooks.forEach(h => console.log(`  * [Hook] ${h}`));
  console.log(`- Stores (${stores.length}):`);
  stores.forEach(s => console.log(`  * [Store] ${s}`));
  console.log(`- Utilities/Helpers (${utils.length}):`);
  utils.forEach(u => console.log(`  * [Util] ${u}`));
  console.log("------------------------------------\n");

  // Kiểm tra trùng lặp tên
  let duplicatesFound = false;
  console.log("--- KIỂM TRA TRÙNG LẶP & SUB-STANDARD ---");
  for (const [name, occurrences] of Object.entries(allModules)) {
    if (occurrences.length > 1) {
      duplicatesFound = true;
      console.warn(`[CẢNH BÁO TRÙNG LẶP] Phát hiện tên trùng lặp '${name}':`);
      occurrences.forEach(occ => {
        console.warn(`  - Kiểu: ${occ.type} tại đường dẫn: ${occ.path}`);
      });
      console.warn("-> ĐỀ XUẤT: Vui lòng kiểm tra và tái sử dụng thành phần hiện có thay vì tạo mới!\n");
    }
  }

  // Kiểm tra vi phạm cấu trúc thư mục (Flat file rules)
  files.forEach(file => {
    const relativePath = path.relative(rootDir, file.path);
    if (
      (relativePath.includes('components/') && !relativePath.includes('/index.') && (file.name.endsWith('.tsx') || file.name.endsWith('.ts'))) ||
      (relativePath.includes('hooks/') && !relativePath.includes('/index.') && file.name.endsWith('.ts'))
    ) {
      // Bỏ qua các file phụ trợ hợp lệ nằm trong folder component/hook
      const parts = relativePath.split('/');
      const parentDirIndex = parts.indexOf('components') !== -1 ? parts.indexOf('components') : parts.indexOf('hooks');
      if (parts.length - parentDirIndex === 2) {
        // Ví dụ: components/Button.tsx (vi phạm folder-first rule)
        console.error(`[VI PHẠM QUY TẮC THƯ CỤC] File flat không được phép: ${relativePath}`);
        console.error(`-> BẮT BUỘC: Bạn phải tạo thư mục riêng cho module này (ví dụ: ${relativePath.replace('.tsx', '/index.tsx').replace('.ts', '/index.ts')})\n`);
        duplicatesFound = true; // Block hoặc cảnh báo
      }
    }
  });

  if (!duplicatesFound) {
    console.log("✅ Không phát hiện trùng lặp hoặc vi phạm cấu trúc thư mục nghiêm trọng.");
  } else {
    console.log("⚠️  Phát hiện một số cảnh báo trùng lặp/vi phạm. Vui lòng rà soát kỹ trước khi viết code mới!");
  }
  
  console.log("\n=== [PRE-CODE HOOK] Hoàn thành kiểm tra ===\n");
  process.exit(0); // Exit 0 để không chặn quá trình nếu chỉ là cảnh báo, hoặc exit 1 nếu muốn chặn vi phạm nghiêm trọng
}

analyzeWorkspace();
