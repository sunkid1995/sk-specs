#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync, spawnSync } from 'child_process';

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

const CONFIG = {
  DIRS: {
    COMPONENTS: 'components',
    HOOKS: 'hooks',
    STORES: ['store', 'stores'],
    UTILS: ['lib', 'utils', 'helpers']
  },
  VALID_SUB_FILES: ['index', 'types', 'constants', 'utils', 'helpers'],
  SUPPORTED_EXTENSIONS: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
  HOOK_PREFIX: 'use-'
};

const cacheDir = path.join(process.cwd(), '.cache');
const cachePath = path.join(cacheDir, 'workspace-modules.json');

function readCache() {
  if (!fs.existsSync(cachePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeCache(data) {
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const tmpPath = cachePath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, cachePath);
  } catch (e) {
    console.error('Không thể ghi cache:', e.message);
  }
}

function getCommitHash() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (e) {
    return 'no-commit';
  }
}

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch (e) {
      continue; // Bỏ qua nếu file bị khóa hoặc không đọc được
    }
    
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

function parseFile(filePath, rootDir) {
  const relativePath = path.relative(rootDir, filePath);
  const parts = relativePath.split(path.sep);
  const fileName = path.basename(filePath);
  const fileBase = path.basename(filePath, path.extname(filePath));

  const lastCompIndex = parts.lastIndexOf(CONFIG.DIRS.COMPONENTS);
  const lastHookIndex = parts.lastIndexOf(CONFIG.DIRS.HOOKS);
  
  let actualStoreIndex = -1;
  for (const storeDir of CONFIG.DIRS.STORES) {
    const idx = parts.lastIndexOf(storeDir);
    if (idx !== -1) {
      actualStoreIndex = idx;
      break;
    }
  }

  // Component: Nằm dưới thư mục 'components/' và tệp chính là index.tsx hoặc index.ts
  if (lastCompIndex !== -1 && (fileName === 'index.tsx' || fileName === 'index.ts')) {
    const compDirParts = parts.slice(0, parts.length - 1);
    const compDir = compDirParts.join('/');
    const compName = parts[parts.length - 2];
    if (compDir !== '' && compName) {
      return { type: 'Component', path: compDir, name: compName };
    }
  }
  // Hook: Nằm dưới thư mục 'hooks/', bắt đầu bằng 'use-' và là index.ts
  else if (
    lastHookIndex !== -1 && 
    fileName === 'index.ts' && 
    parts[parts.length - 2] && 
    parts[parts.length - 2].startsWith(CONFIG.HOOK_PREFIX)
  ) {
    const hookDirParts = parts.slice(0, parts.length - 1);
    const hookDir = hookDirParts.join('/');
    const hookName = parts[parts.length - 2];
    if (hookDir !== '' && hookName) {
      return { type: 'Hook', path: hookDir, name: hookName };
    }
  }
  // Store: Nằm trong 'store' hoặc 'stores', hoặc file kết thúc bằng '.store.ts'
  else if (actualStoreIndex !== -1 || fileName.endsWith('.store.ts')) {
    let storeName = '';
    let storeDir = '';

    if (fileName.endsWith('.store.ts')) {
      storeName = fileName.replace('.store.ts', '');
      storeDir = relativePath;
    } else if (parts[actualStoreIndex + 1]) {
      const storeParts = parts.slice(0, actualStoreIndex + 2);
      storeDir = storeParts.join('/');
      storeName = parts[actualStoreIndex + 1];
    }

    if (storeName && storeDir !== '') {
      return { type: 'Store', path: storeDir, name: storeName };
    }
  }
  // Utility / Helper: các file trong lib/, utils/, helpers/
  else if (fileName.endsWith('.ts') || fileName.endsWith('.js')) {
    const isUtilPath = CONFIG.DIRS.UTILS.some(utilDir => parts.includes(utilDir));
    if (isUtilPath) {
      let utilName = '';
      if (fileName === 'index.ts' || fileName === 'index.js') {
        utilName = parts[parts.length - 2] || 'index';
      } else {
        utilName = fileBase;
      }
      if (utilName) {
        return { type: 'Utility/Helper', path: relativePath, name: utilName };
      }
    }
  }
  return null;
}

function scanFullWorkspace(rootDir) {
  const srcDir = path.join(rootDir, 'src');
  const files = fs.existsSync(srcDir) ? walkDir(srcDir) : walkDir(rootDir);

  const components = [];
  const hooks = [];
  const stores = [];
  const utils = [];
  const allModules = {};

  files.forEach(file => {
    const result = parseFile(file.path, rootDir);
    if (!result) return;

    if (result.type === 'Component') {
      if (!components.includes(result.path)) components.push(result.path);
    } else if (result.type === 'Hook') {
      if (!hooks.includes(result.path)) hooks.push(result.path);
    } else if (result.type === 'Store') {
      if (!stores.includes(result.path)) stores.push(result.path);
    } else if (result.type === 'Utility/Helper') {
      if (!utils.includes(result.path)) utils.push(result.path);
    }

    if (!allModules[result.name]) allModules[result.name] = [];
    allModules[result.name].push({ type: result.type, path: result.path });
  });

  return { components, hooks, stores, utils, allModules };
}

function applyDeltaUpdate(baseline, currentUncommitted, rootDir) {
  // Clone baseline
  const data = {
    components: [...baseline.components],
    hooks: [...baseline.hooks],
    stores: [...baseline.stores],
    utils: [...baseline.utils],
    allModules: JSON.parse(JSON.stringify(baseline.allModules))
  };

  currentUncommitted.forEach(fileInfo => {
    const relPath = path.relative(rootDir, fileInfo.path);

    // Xử lý khi file bị xóa (mtime = 0 hoặc không tồn tại)
    if (fileInfo.mtime === 0 || !fs.existsSync(fileInfo.path)) {
      for (const name in data.allModules) {
        data.allModules[name] = data.allModules[name].filter(m => {
          if (m.path === relPath || relPath.startsWith(m.path + '/')) {
            return false;
          }
          return true;
        });
        if (data.allModules[name].length === 0) {
          delete data.allModules[name];
        }
      }

      data.components = data.components.filter(p => !relPath.startsWith(p + '/') && p !== relPath);
      data.hooks = data.hooks.filter(p => !relPath.startsWith(p + '/') && p !== relPath);
      data.stores = data.stores.filter(p => !relPath.startsWith(p + '/') && p !== relPath);
      data.utils = data.utils.filter(p => p !== relPath);
      return;
    }

    const result = parseFile(fileInfo.path, rootDir);
    if (!result) return;

    if (result.type === 'Component') {
      if (!data.components.includes(result.path)) data.components.push(result.path);
    } else if (result.type === 'Hook') {
      if (!data.hooks.includes(result.path)) data.hooks.push(result.path);
    } else if (result.type === 'Store') {
      if (!data.stores.includes(result.path)) data.stores.push(result.path);
    } else if (result.type === 'Utility/Helper') {
      if (!data.utils.includes(result.path)) data.utils.push(result.path);
    }

    if (!data.allModules[result.name]) data.allModules[result.name] = [];
    const exists = data.allModules[result.name].some(m => m.path === result.path && m.type === result.type);
    if (!exists) {
      data.allModules[result.name].push({ type: result.type, path: result.path });
    }
  });

  return data;
}

function analyzeWorkspace() {
  const rootDir = process.cwd();
  const startTime = Date.now();
  console.log(`=== [PRE-CODE HOOK] Bắt đầu quét không gian làm việc: ${rootDir} ===\n`);

  const forceClean = process.argv.includes('--force-clean');
  const currentCommit = getCommitHash();

  // Lấy danh sách file thay đổi từ git status
  let rawPaths = [];
  try {
    const gitOutput = execSync('git status --porcelain', { encoding: 'utf8' });
    rawPaths = gitOutput
      .split('\n')
      .map(line => line.slice(3).trim())
      .filter(Boolean)
      .map(p => path.resolve(rootDir, p));
  } catch (e) {}

  const changedFiles = [];
  rawPaths.forEach(p => {
    const relative = path.relative(rootDir, p);
    const parts = relative.split(path.sep);
    
    // Bỏ qua nếu file/folder nằm trong danh sách ignore
    const hasIgnored = parts.some(part => IGNORED_DIRS.has(part) || IGNORED_FILES.has(part));
    if (hasIgnored) return;

    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        const subFiles = walkDir(p);
        subFiles.forEach(sf => {
          const relSub = path.relative(rootDir, sf.path);
          const partsSub = relSub.split(path.sep);
          const hasIgnoredSub = partsSub.some(part => IGNORED_DIRS.has(part) || IGNORED_FILES.has(part));
          if (!hasIgnoredSub) {
            changedFiles.push(sf.path);
          }
        });
      } else {
        changedFiles.push(p);
      }
    } else {
      changedFiles.push(p); // File bị xóa
    }
  });

  const currentUncommitted = changedFiles.map(p => {
    let mtime = 0;
    try {
      if (fs.existsSync(p)) mtime = fs.statSync(p).mtimeMs;
    } catch (e) {}
    return { path: p, mtime };
  });

  // Đọc cache
  let cache = forceClean ? null : readCache();
  let moduleData = null;
  let cacheHit = false;

  if (cache && cache.lastCommit === currentCommit) {
    const isUncommittedEqual = 
      cache.uncommittedFiles &&
      cache.uncommittedFiles.length === currentUncommitted.length &&
      cache.uncommittedFiles.every((f, i) => f.path === currentUncommitted[i].path && f.mtime === currentUncommitted[i].mtime);

    if (isUncommittedEqual) {
      console.log('ℹ️  [PRE-CODE HOOK] Đang sử dụng dữ liệu từ cache (Không có thay đổi).');
      moduleData = cache.current;
      cacheHit = true;
    } else {
      console.log('ℹ️  [PRE-CODE HOOK] Phát hiện thay đổi chưa commit mới. Đang delta-update cache...');
      moduleData = applyDeltaUpdate(cache.baseline, currentUncommitted, rootDir);
      
      cache.uncommittedFiles = currentUncommitted;
      cache.current = moduleData;
      writeCache(cache);
    }
  } else {
    if (forceClean) {
      console.log('ℹ️  [PRE-CODE HOOK] Bắt buộc quét lại toàn bộ (force-clean)...');
    } else {
      console.log('ℹ️  [PRE-CODE HOOK] Cache trống hoặc Commit HEAD thay đổi. Đang quét lại toàn bộ workspace...');
    }

    const rawData = scanFullWorkspace(rootDir);
    // baseline = rawData lọc bỏ các file chưa commit
    const baseline = applyDeltaUpdate(rawData, currentUncommitted.map(f => ({ path: f.path, mtime: 0 })), rootDir);

    moduleData = rawData;

    writeCache({
      lastCommit: currentCommit,
      uncommittedFiles: currentUncommitted,
      baseline: baseline,
      current: moduleData
    });
  }

  const { components, hooks, stores, utils, allModules } = moduleData;

  // Liệt kê tài sản hiện có cho AI Agent
  console.log("--- DANH SÁCH TÀI NGUYÊN HIỆN CÓ (TỔNG QUAN) ---");
  console.log(`- Components: ${components.length}`);
  console.log(`- Hooks: ${hooks.length}`);
  console.log(`- Stores: ${stores.length}`);
  console.log(`- Utilities/Helpers: ${utils.length}`);
  console.log("------------------------------------------------\n");

  // Kiểm tra trùng lặp tên và vi phạm cấu trúc
  let hasWarnings = false;
  let hasErrors = false;

  console.log("--- KIỂM TRA TRÙNG LẶP & SUB-STANDARD ---");

  // Kiểm tra trùng lặp tên (Warning — không chặn)
  for (const [name, occurrences] of Object.entries(allModules)) {
    if (occurrences.length > 1) {
      hasWarnings = true;
      console.warn(`[CẢNH BÁO TRÙNG LẶP] Phát hiện tên trùng lặp '${name}':`);
      occurrences.forEach(occ => {
        console.warn(`  - Kiểu: ${occ.type} tại đường dẫn: ${occ.path}`);
      });
      console.warn("-> ĐỀ XUẤT: Vui lòng kiểm tra và tái sử dụng thành phần hiện có thay vì tạo mới!\n");
    }
  }

  // Duyệt trực tiếp qua các file thay đổi để kiểm tra Folder-First và Quy tắc đặt tên
  changedFiles.forEach(absolutePath => {
    if (!absolutePath.startsWith(path.join(rootDir, 'src'))) {
      return;
    }

    if (!fs.existsSync(absolutePath)) {
      return;
    }

    const relativePath = path.relative(rootDir, absolutePath);
    const parts = relativePath.split(path.sep);
    const fileName = path.basename(absolutePath);
    const fileExt = path.extname(absolutePath);

    if (!CONFIG.SUPPORTED_EXTENSIONS.includes(fileExt)) {
      return;
    }

    const lastCompIndex = parts.lastIndexOf(CONFIG.DIRS.COMPONENTS);
    const lastHookIndex = parts.lastIndexOf(CONFIG.DIRS.HOOKS);

    // 1. Kiểm tra Folder-First và đặt tên cho component
    if (lastCompIndex !== -1) {
      const distance = parts.length - 1 - lastCompIndex;
      if (distance === 1) {
        hasErrors = true;
        console.error(`[VI PHẠM QUY TẮC THƯ MỤC] File flat không được phép trực tiếp dưới components/: ${relativePath}`);
        console.error(`-> BẮT BUỘC: Bạn phải tạo thư mục riêng cho module này (ví dụ: ${relativePath.replace(fileExt, '/index' + fileExt)})\n`);
      }
      else {
        const folderName = parts[parts.length - 2];
        const baseName = path.basename(fileName, fileExt);

        // Kiểm tra file component chính (.tsx hoặc .ts chứa JSX/logic chính)
        if (fileExt === '.tsx') {
          const isAllowedTsx = fileName === 'index.tsx' || fileName.endsWith('.spec.tsx');
          if (!isAllowedTsx) {
            hasErrors = true;
            console.error(`[VI PHẠM QUY TẮC THƯ MỤC] File flat component con không được phép: ${relativePath}`);
            console.error(`-> BẮT BUỘC: Mọi component phải sử dụng index.tsx làm file chính. Hãy chuyển file này thành thư mục con với index.tsx (ví dụ: .../${baseName}/index.tsx) hoặc đổi tên thành index.tsx.\n`);
          }
        } else if (fileExt === '.ts') {
          const isStandardName = CONFIG.VALID_SUB_FILES.includes(baseName) || fileName.endsWith('.spec.ts');

          if (!isStandardName) {
            hasErrors = true;
            console.error(`[VI PHẠM QUY TẮC ĐẶT TÊN] Tên file không hợp lệ trong thư mục component: ${relativePath}`);
            console.error(`-> BẮT BUỘC: Chỉ cho phép các file phụ trợ chuẩn: ${CONFIG.VALID_SUB_FILES.join('.ts, ') + '.ts'} hoặc *.spec.ts.\n`);
          } else {
            if (baseName !== 'index' && folderName && (baseName.toLowerCase() === folderName.toLowerCase() || baseName.toLowerCase().startsWith(folderName.toLowerCase() + '.'))) {
              hasErrors = true;
              console.error(`[VI PHẠM QUY TẮC ĐẶT TÊN] Đặt tên file bị lặp lại thừa (Redundant Naming): ${relativePath}`);
              console.error(`-> BẮT BUỘC: Tránh sử dụng tên lặp lại ${fileName} trong thư mục ${folderName}/. Sử dụng tên chuẩn như types.ts, constants.ts.\n`);
            }
          }
        }
      }
    }

    // 2. Kiểm tra Folder-First và đặt tên cho hook
    if (lastHookIndex !== -1) {
      const distance = parts.length - 1 - lastHookIndex;
      if (distance === 1) {
        hasErrors = true;
        console.error(`[VI PHẠM QUY TẮC THƯ MỤC] File flat không được phép trực tiếp dưới hooks/: ${relativePath}`);
        console.error(`-> BẮT BUỘC: Bạn phải tạo thư mục riêng cho hook này (ví dụ: ${relativePath.replace(fileExt, '/index' + fileExt)})\n`);
      }
      else {
        const folderName = parts[parts.length - 2];
        const baseName = path.basename(fileName, fileExt);

        if (fileExt === '.ts') {
          const isStandardName = CONFIG.VALID_SUB_FILES.includes(baseName) || fileName.endsWith('.spec.ts');

          if (!isStandardName) {
            hasErrors = true;
            console.error(`[VI PHẠM QUY TẮC ĐẶT TÊN] Tên file không hợp lệ trong thư mục hook: ${relativePath}`);
            console.error(`-> BẮT BUỘC: Chỉ cho phép các file: ${CONFIG.VALID_SUB_FILES.join('.ts, ') + '.ts'} hoặc *.spec.ts.\n`);
          } else {
            if (baseName !== 'index' && folderName && (baseName.toLowerCase() === folderName.toLowerCase() || baseName.toLowerCase().startsWith(folderName.toLowerCase() + '.'))) {
              hasErrors = true;
              console.error(`[VI PHẠM QUY TẮC ĐẶT TÊN] Đặt tên file bị lặp lại thừa (Redundant Naming): ${relativePath}`);
              console.error(`-> BẮT BUỘC: Tránh sử dụng tên lặp lại ${fileName} trong thư mục ${folderName}/. Sử dụng tên chuẩn như index.ts, types.ts.\n`);
            }
          }
        }
      }
    }
  });

  if (!hasWarnings && !hasErrors) {
    console.log("✅ Không phát hiện trùng lặp hoặc vi phạm cấu trúc thư mục nghiêm trọng.");
  } else if (hasWarnings && !hasErrors) {
    console.log("⚠️  Phát hiện một số cảnh báo trùng lặp (không chặn). Vui lòng rà soát kỹ trước khi viết code mới!");
  }

  if (hasErrors) {
    console.error("\n❌ HOOK THẤT BẠI: Phát hiện vi phạm cấu trúc thư mục (Folder-First rule hoặc Redundant Naming).");
    console.error("-> YÊU CẦU: Sửa tất cả vi phạm cấu trúc trên trước khi tiếp tục viết code.");
  }

  const duration = Date.now() - startTime;
  console.log(`\n=== [PRE-CODE HOOK] Hoàn thành kiểm tra trong ${duration}ms ===\n`);

  // Cập nhật Workspace Intelligence Layer metadata (Phase 1)
  // Chạy non-blocking để không ảnh hưởng đến exit code của pre-code hook
  try {
    const intelligenceScript = path.join(rootDir, '.agents', 'hooks', 'generate-workspace-intelligence.js');
    if (fs.existsSync(intelligenceScript)) {
      console.log('🧠 [WORKSPACE INTELLIGENCE] Đang cập nhật metadata cache...');
      const result = spawnSync(process.execPath, [intelligenceScript], {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: 'pipe',
      });
      if (result.status === 0) {
        console.log('✅ [WORKSPACE INTELLIGENCE] Metadata cache đã được cập nhật.');
        console.log('   → Agent nên đọc .cache/workspace-summary.md trước khi mở source code.');
      } else {
        console.warn('⚠️  [WORKSPACE INTELLIGENCE] Không thể cập nhật metadata cache (non-blocking).');
        if (result.stderr) console.warn(result.stderr.trim());
      }
    }
  } catch (e) {
    // Không chặn pre-code nếu intelligence script lỗi
    console.warn('⚠️  [WORKSPACE INTELLIGENCE] Lỗi khi chạy script (non-blocking):', e.message);
  }

  process.exit(hasErrors ? 1 : 0);
}

analyzeWorkspace();
