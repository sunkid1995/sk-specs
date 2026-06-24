#!/usr/bin/env node

/**
 * Workspace Intelligence Layer v2 — Phase 2A (AST-driven)
 *
 * Output trong .cache/:
 *   - workspace-summary.md
 *   - feature-map.json
 *   - dependency-graph.json
 *   - reverse-imports.json
 *   - module-manifest.json
 *   - workspace-intelligence.json
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getConfig } from './config-loader.js';

const config = getConfig();

// Import các module con chuyên trách
import { parseFileAst } from './intelligence/ast-parser.js';
import {
  buildDependencyGraph,
  buildReverseImports,
  buildModuleManifest
} from './intelligence/graph-analyzer.js';
import {
  buildFeatureMap,
  buildWorkspaceSummary
} from './intelligence/reporter.js';

// ─── Constants ──────────────────────────────────────────────────────────────

const IGNORED_DIRS = new Set(config.ignoredDirs);

const SOURCE_EXTENSIONS = new Set(config.sourceExtensions);

const ALIAS_TO_SRC = config.aliasToSrc;

// ─── Paths ──────────────────────────────────────────────────────────────────

const rootDir  = process.cwd();
const srcDir   = path.join(rootDir, 'src');
const cacheDir = path.join(rootDir, '.cache');
const intelligenceCachePath = path.join(cacheDir, 'workspace-intelligence.json');

// ─── Utilities ──────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return null; }
}

function getCommitHash() {
  try { return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(); }
  catch { return 'no-commit'; }
}

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return fileList; }
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    let stat;
    try { stat = fs.statSync(fullPath); } catch { continue; }
    if (stat.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function getMtime(filePath) {
  try { return fs.statSync(filePath).mtimeMs; } catch { return 0; }
}

// ─── Delta Cache ──────────────────────────────────────────────────────────

function getUncommittedFiles() {
  let rawPaths = [];
  try {
    const gitOutput = execSync('git status --porcelain', { encoding: 'utf8' });
    rawPaths = gitOutput
      .split('\n')
      .map(line => line.slice(3).trim())
      .filter(Boolean)
      .map(p => path.resolve(rootDir, p));
  } catch { /* git không có hoặc không phải repo */ }

  const result = [];
  for (const p of rawPaths) {
    const rel = path.relative(rootDir, p);
    const parts = rel.split(path.sep);
    if (parts.some(part => IGNORED_DIRS.has(part))) continue;
    result.push({ path: p, mtime: getMtime(p) });
  }
  return result;
}

function uncommittedFilesEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((f, i) => f.path === b[i].path && f.mtime === b[i].mtime);
}

// ─── Module Classification ──────────────────────────────────────────────────

function classifyModule(absolutePath) {
  const rel     = path.relative(srcDir, absolutePath);
  const parts   = rel.split(path.sep);
  const fileName = path.basename(absolutePath);
  const fileBase = path.basename(absolutePath, path.extname(absolutePath));

  let info = null;

  const compIdx = parts.lastIndexOf('components');
  if (compIdx !== -1 && (fileName === 'index.tsx' || fileName === 'index.ts')) {
    const name = parts[parts.length - 2];
    if (name && name !== 'components') {
      info = { type: 'Component', name, feature: inferFeature(parts), relativePath: rel };
    }
  }

  if (!info) {
    const hookIdx = parts.lastIndexOf('hooks');
    if (
      hookIdx !== -1 &&
      (fileName === 'index.ts' || fileName === 'index.tsx') &&
      parts[parts.length - 2]?.startsWith('use-')
    ) {
      info = { type: 'Hook', name: parts[parts.length - 2], feature: inferFeature(parts), relativePath: rel };
    }
  }

  if (!info) {
    const hookIdx = parts.lastIndexOf('hooks');
    if (hookIdx !== -1 && (fileBase.startsWith('use-') || /^use[A-Z]/.test(fileBase))) {
      info = { type: 'Hook', name: fileBase, feature: inferFeature(parts), relativePath: rel };
    }
  }

  if (!info) {
    const storeIdx = Math.max(parts.lastIndexOf('store'), parts.lastIndexOf('stores'));
    if (storeIdx !== -1 || fileName.endsWith('.store.ts')) {
      let name = fileBase.replace(/\.store$/, '');
      if (fileName === 'index.ts' && storeIdx !== -1 && parts.length > storeIdx + 2) {
        name = parts[parts.length - 2];
      }
      info = { type: 'Store', name, feature: inferFeature(parts), relativePath: rel };
    }
  }

  if (!info) {
    const serviceIdx = parts.indexOf('services');
    if (serviceIdx !== -1 && !fileName.startsWith('index')) {
      info = { type: 'Service', name: fileBase, feature: inferFeature(parts), relativePath: rel };
    }
  }

  if (!info) {
    if (parts.includes('contexts') || parts.includes('providers')) {
      const name = fileBase !== 'index' ? fileBase : (parts[parts.length - 2] || fileBase);
      info = { type: 'Context', name, feature: inferFeature(parts), relativePath: rel };
    }
  }

  if (!info) {
    if (parts.includes('lib') || parts.includes('utils') || parts.includes('helpers')) {
      const name = fileBase !== 'index' ? fileBase : (parts[parts.length - 2] || fileBase);
      info = { type: 'Utility', name, feature: inferFeature(parts), relativePath: rel };
    }
  }

  if (!info) return null;

  info.key = `${info.feature}:${info.name}`;
  return info;
}

function inferFeature(parts) {
  const featIdx = parts.indexOf('features');
  if (featIdx !== -1 && parts[featIdx + 1]) return parts[featIdx + 1];

  const pageIdx = parts.indexOf('pages');
  if (pageIdx !== -1 && parts[pageIdx + 1]) return parts[pageIdx + 1];

  if (parts.includes('shared')) return 'shared';

  const storeIdx = Math.max(parts.indexOf('store'), parts.indexOf('stores'));
  if (storeIdx !== -1 && parts[storeIdx + 1]) return parts[storeIdx + 1];

  const elemIdx = parts.indexOf('elements');
  if (elemIdx !== -1 && parts[elemIdx + 1]) return parts[elemIdx + 1];

  const appIdx = parts.indexOf('app');
  if (appIdx !== -1 && parts[appIdx + 1]) return parts[appIdx + 1];

  return 'core';
}

function resolveAliasToAbsolute(importPath) {
  for (const [alias, srcRelative] of Object.entries(ALIAS_TO_SRC)) {
    if (importPath.startsWith(alias + '/') || importPath === alias) {
      const after = importPath.slice(alias.length).replace(/^\//, '');
      return path.join(srcDir, srcRelative, after);
    }
  }
  return null;
}

// ─── Import Parser ──────────────────────────────────────────────────────────

function parseImportKeys(absolutePath, modulesByPath) {
  const { imports: rawImports } = parseFileAst(absolutePath);
  const keys = new Set();

  for (const rawPath of rawImports) {
    let resolvedAbs = null;

    if (rawPath.startsWith('@')) {
      resolvedAbs = resolveAliasToAbsolute(rawPath);
    }
    else if (rawPath.startsWith('.')) {
      resolvedAbs = path.resolve(path.dirname(absolutePath), rawPath);
    }
    else {
      continue;
    }

    if (!resolvedAbs) continue;

    const candidates = [
      resolvedAbs,
      resolvedAbs + '.ts',
      resolvedAbs + '.tsx',
      resolvedAbs + '.js',
      resolvedAbs + '.jsx',
      path.join(resolvedAbs, 'index.ts'),
      path.join(resolvedAbs, 'index.tsx'),
      path.join(resolvedAbs, 'index.js'),
    ];

    for (const candidate of candidates) {
      const key = modulesByPath.get(candidate);
      if (key) {
        keys.add(key);
        break;
      }
    }
  }

  return [...keys];
}

// ─── Export Scanner ─────────────────────────────────────────────────────────

function scanExports(absolutePath) {
  return parseFileAst(absolutePath).exports;
}

// ─── Core Analysis ──────────────────────────────────────────────────────────

function analyzeWorkspace() {
  const files = walkDir(srcDir);
  const moduleMap = new Map();
  const modulesByPath = new Map();

  for (const file of files) {
    const base = path.basename(file);
    if (base.includes('.spec.') || base.includes('.test.')) continue;

    const info = classifyModule(file);
    if (!info) continue;

    const { key } = info;

    if (!moduleMap.has(key)) {
      moduleMap.set(key, {
        ...info,
        imports: [],
        exports: [],
        files: [file],
      });
    } else {
      moduleMap.get(key).files.push(file);
    }

    modulesByPath.set(file, key);
  }

  for (const [key, entry] of moduleMap) {
    const allImportKeys = new Set();
    for (const file of entry.files) {
      const importKeys = parseImportKeys(file, modulesByPath);
      for (const k of importKeys) {
        if (k !== key) allImportKeys.add(k);
      }
    }
    entry.imports = [...allImportKeys];

    const mainFile = entry.files.find(
      f => path.basename(f) === 'index.ts' || path.basename(f) === 'index.tsx'
    ) || entry.files[0];

    if (mainFile) {
      entry.exports = scanExports(mainFile);
    }
  }

  return { moduleMap, modulesByPath };
}

// ─── Delta Cache ──────────────────────────────────────────────────────────

function applyDeltaUpdate(baseline, currentUncommitted, rootDir) {
  const data = {
    components: [...baseline.components],
    hooks: [...baseline.hooks],
    stores: [...baseline.stores],
    utils: [...baseline.utils],
    allModules: JSON.parse(JSON.stringify(baseline.allModules))
  };

  currentUncommitted.forEach(fileInfo => {
    const relPath = path.relative(rootDir, fileInfo.path);

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

    const result = classifyModule(fileInfo.path);
    if (!result) return;

    if (result.type === 'Component') {
      if (!data.components.includes(result.relativePath)) data.components.push(result.relativePath);
    } else if (result.type === 'Hook') {
      if (!data.hooks.includes(result.relativePath)) data.hooks.push(result.relativePath);
    } else if (result.type === 'Store') {
      if (!data.stores.includes(result.relativePath)) data.stores.push(result.relativePath);
    } else if (result.type === 'Utility') {
      if (!data.utils.includes(result.relativePath)) data.utils.push(result.relativePath);
    }

    if (!data.allModules[result.name]) data.allModules[result.name] = [];
    const exists = data.allModules[result.name].some(m => m.path === result.relativePath && m.type === result.type);
    if (!exists) {
      data.allModules[result.name].push({ type: result.type, path: result.relativePath });
    }
  });

  return data;
}

function getCacheState() {
  return readJson(intelligenceCachePath);
}

function isCacheValid(commitHash, currentUncommitted) {
  const meta = getCacheState();
  if (!meta) return false;
  if (meta.commitHash !== commitHash) return false;
  if (!uncommittedFilesEqual(meta.uncommittedFiles, currentUncommitted)) return false;

  const requiredFiles = [
    'workspace-summary.md',
    'feature-map.json',
    'dependency-graph.json',
    'reverse-imports.json',
    'module-manifest.json',
  ];
  return requiredFiles.every(f => fs.existsSync(path.join(cacheDir, f)));
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const forceRegen = process.argv.includes('--force');
  const commitHash = getCommitHash();
  const currentUncommitted = getUncommittedFiles();

  console.log('=== [WORKSPACE INTELLIGENCE] Phase 2A (AST-driven) ===\n');

  if (!forceRegen && isCacheValid(commitHash, currentUncommitted)) {
    console.log('ℹ️  Cache hợp lệ — không cần regenerate.');
    console.log('   Dùng --force để bắt buộc tạo lại.\n');
    console.log('📂 Metadata location:');
    console.log(`   .cache/workspace-summary.md`);
    console.log(`   .cache/module-manifest.json`);
    console.log(`   .cache/feature-map.json`);
    console.log(`   .cache/dependency-graph.json`);
    console.log(`   .cache/reverse-imports.json\n`);
    process.exit(0);
  }

  ensureDir(cacheDir);
  const startTime = Date.now();

  console.log(`🔍 Phân tích workspace...`);
  if (currentUncommitted.length > 0) {
    console.log(`   -> ${currentUncommitted.length} file uncommitted đang được theo dõi`);
  }

  const { moduleMap } = analyzeWorkspace();
  console.log(`   -> Phân loại được ${moduleMap.size} modules (unique key)\n`);

  console.log('📊 Xây dựng dependency graph...');
  const depGraph = buildDependencyGraph(moduleMap);

  console.log('🔁 Xây dựng reverse import index...');
  const reverseImports = buildReverseImports(moduleMap);

  console.log('🗺️  Xây dựng feature map...');
  const featureMap = buildFeatureMap(moduleMap);

  console.log('📦 Xây dựng module manifest...');
  const manifest = buildModuleManifest(moduleMap, reverseImports);

  console.log('📝 Sinh workspace-summary.md...');
  const summary = buildWorkspaceSummary(featureMap, moduleMap);

  // Write artifacts
  console.log('\n💾 Ghi artifacts vào .cache/...');

  fs.writeFileSync(path.join(cacheDir, 'workspace-summary.md'), summary, 'utf8');
  console.log('   ✅ workspace-summary.md');

  writeJson(path.join(cacheDir, 'feature-map.json'), featureMap);
  console.log('   ✅ feature-map.json');

  writeJson(path.join(cacheDir, 'dependency-graph.json'), depGraph);
  console.log('   ✅ dependency-graph.json');

  writeJson(path.join(cacheDir, 'reverse-imports.json'), reverseImports);
  console.log('   ✅ reverse-imports.json');

  writeJson(path.join(cacheDir, 'module-manifest.json'), manifest);
  console.log('   ✅ module-manifest.json');

  // Save delta cache metadata
  writeJson(intelligenceCachePath, {
    version:          '2A',
    commitHash,
    uncommittedFiles: currentUncommitted,
    generatedAt:      new Date().toISOString(),
    totalModules:     moduleMap.size,
    features:         Object.keys(featureMap).length,
  });
  console.log('   ✅ workspace-intelligence.json (cache metadata)');

  const duration = Date.now() - startTime;

  console.log(`\n=== [WORKSPACE INTELLIGENCE] Hoàn thành trong ${duration}ms ===`);
  console.log(`   Modules: ${moduleMap.size} | Features: ${Object.keys(featureMap).length}`);
  console.log('');
  console.log('📂 Agent nên đọc theo thứ tự:');
  console.log('   1. .cache/workspace-summary.md     <- Tổng quan nhanh');
  console.log('   2. .cache/module-manifest.json     <- Chi tiết 1 module');
  console.log('   3. .cache/feature-map.json         <- Tìm theo feature');
  console.log('   4. .cache/dependency-graph.json    <- Impact analysis');
  console.log('   5. .cache/reverse-imports.json     <- Ai dùng module này');
  console.log('');

  process.exit(0);
}

main();
