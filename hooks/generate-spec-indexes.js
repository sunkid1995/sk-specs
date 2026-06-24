#!/usr/bin/env node

/**
 * Retroactively tạo/cập nhật _index.md cho các spec folder.
 * Bao gồm field `search` với keyword segments để tìm kiếm tương đồng.
 *
 * Cách dùng:
 *   node .agents/hooks/generate-spec-indexes.js [--dry-run] [--force]
 *
 *   --dry-run  : Chỉ in ra kết quả, không ghi file
 *   --force    : Ghi đè cả _index.md đã tồn tại
 */

import fs from 'fs';
import path from 'path';
import { getConfig } from './config-loader.js';

const config = getConfig();
const specsDir = path.join(process.cwd(), 'sk-specs');
const dryRun   = process.argv.includes('--dry-run');
const force    = process.argv.includes('--force');

if (!fs.existsSync(specsDir)) {
  console.error('Không tìm thấy thư mục sk-specs/');
  process.exit(1);
}

// ─── Stop words — không đưa vào search field ─────────────────────────────────

const STOP_WORDS = new Set(config.stopWords);

// ─── Helpers: Classification ─────────────────────────────────────────────────

function detectType(folderName) {
  if (folderName.startsWith('fix-'))      return 'bugfix';
  if (folderName.startsWith('refactor-')) return 'refactor';
  if (folderName.startsWith('optimize-')) return 'refactor';
  return 'feature';
}

function detectStatus(folderPath) {
  const candidates = [
    '03-task-breakdown.md', 'task.md', 'progress.md',
    '03-fix-strategy.md', '03-risk-analysis.md',
  ];
  for (const f of candidates) {
    const fp = path.join(folderPath, f);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
    if (content.includes('- [ ]') || content.includes('- [/]')) return 'active';
    return 'done';
  }
  return 'done';
}

function extractTaskName(folderPath) {
  const candidates = ['01-feature-analysis.md', '01-bug-analysis.md', '01-refactor-analysis.md'];
  for (const f of candidates) {
    const fp = path.join(folderPath, f);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
    const h1 = content.match(/^#\s+(.+)/m);
    if (h1) return h1[1].trim();
  }
  return null;
}

function extractAffectedFiles(folderPath) {
  const files = new Set();
  const srcPattern = /src\/[^\s'"`,)]+\.(tsx?|jsx?|scss)/g;
  const specFiles = fs.readdirSync(folderPath)
    .filter(f => f.endsWith('.md') && f !== '_index.md');
  for (const sf of specFiles) {
    const content = fs.readFileSync(path.join(folderPath, sf), 'utf8');
    let match;
    while ((match = srcPattern.exec(content)) !== null) {
      files.add(match[0].replace(/['"`),]/g, '').trim());
    }
    srcPattern.lastIndex = 0;
  }
  return [...files].slice(0, 6);
}

function extractRisk(folderPath) {
  const candidates = ['03-task-breakdown.md', '03-fix-strategy.md', '03-risk-analysis.md', '02-root-cause.md'];
  for (const f of candidates) {
    const fp = path.join(folderPath, f);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
    const section = content.match(/##\s+[Rr]isk[^\n]*\n([\s\S]*?)(?:\n##|$)/);
    if (section) {
      const bullet = section[1].match(/[-*]\s+(.+)/);
      if (bullet) return bullet[1].trim();
    }
  }
  return 'Chưa xác định';
}

// ─── Helpers: Keyword extraction ─────────────────────────────────────────────

/**
 * Tokenize một string thành array keyword lowercase.
 * Tách theo: dấu cách, gạch ngang, gạch dưới, dấu `/`, dấu `.`
 */
function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9àáâãèéêìíòóôõùúăđĩũơưạặầấ]/g, ' ')
    .split(/\s+/)
    .map(s => s.trim())
    .filter(s =>
      s.length > 2 &&
      !STOP_WORDS.has(s) &&
      !/^\d+$/.test(s) &&          // Bỏ chuỗi chỉ chứa số (năm, ngày)
      !/\d{4}/.test(s) &&          // Bỏ chuỗi chứa năm như 2026
      !/^[a-z]{1,2}$/.test(s)      // Bỏ chuỗi quá ngắn
    );
}

/**
 * Trích xuất các meaningful segment từ file path.
 * Bỏ qua các phần: src, app, components, pages, protected-page, ...
 * Lấy: tên feature folder, tên component folder, tên file (bỏ extension)
 */
function extractPathSegments(filePath) {
  const SKIP_SEGMENTS = new Set(config.skipSegments);

  return filePath
    .replace(/\.(tsx?|jsx?|scss)$/, '')
    .split('/')
    .flatMap(seg => seg.split('-'))
    .map(s => s.toLowerCase().trim())
    .filter(s => s.length > 2 && !SKIP_SEGMENTS.has(s) && !STOP_WORDS.has(s));
}

/**
 * Tổng hợp keyword từ 3 nguồn đáng tin cậy nhất:
 * 1. Folder name  — chắc chắn là English keyword
 * 2. Task name    — chỉ lấy nếu toàn ASCII (bỏ tiếng Việt)
 * 3. File paths   — extract segment có nghĩa
 */
function buildSearchKeywords(folderName, taskName, affectedFiles) {
  const keywords = new Set();

  // 1. Từ folder name — trọng số cao nhất, luôn là English
  tokenize(folderName.replace(/^(fix|refactor|optimize|upgrade|add|remove)-/, ''))
    .forEach(k => keywords.add(k));

  // 2. Từ task name — chỉ lấy nếu toàn ký tự ASCII (tránh tiếng Việt noise)
  if (taskName && !/[àáâãèéêìíòóôõùúăđĩũơưạặầấ]/.test(taskName)) {
    tokenize(taskName).forEach(k => keywords.add(k));
  }

  // 3. Từ file paths — extract segment kỹ thuật có nghĩa
  for (const f of affectedFiles) {
    extractPathSegments(f).forEach(k => keywords.add(k));
  }
  // Không dùng heading spec content — quá nhiều noise tiếng Việt không dấu

  // Loại bỏ lại stop words lần cuối và giới hạn số lượng
  const filtered = [...keywords]
    .filter(k => {
      if (!k || k.length <= 2) return false;
      if (STOP_WORDS.has(k)) return false;
      if (k.includes('.')) return false;                         // index.spec, modal.store
      if (/[àáâãèéêìíòóôõùúăđĩũơưạặầấ]/.test(k)) return false; // từ tiếng Việt có unicode
      return true;
    })
    .slice(0, 12);

  return filtered;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const items = fs.readdirSync(specsDir)
  .filter(item => fs.statSync(path.join(specsDir, item)).isDirectory());

let created = 0;
let updated = 0;
let skipped = 0;

console.log(`\n🔍 Scanning ${items.length} spec folders...\n`);

for (const item of items) {
  const folderPath = path.join(specsDir, item);
  const indexPath  = path.join(folderPath, '_index.md');
  const exists     = fs.existsSync(indexPath);

  if (exists && !force) {
    // Kiểm tra xem đã có field `search` chưa
    const current = fs.readFileSync(indexPath, 'utf8');
    if (current.includes('search:')) {
      console.log(`  ⏭  ${item} — đã có search field`);
      skipped++;
      continue;
    }
    // Có _index.md nhưng chưa có search → append search field
    const type         = detectType(item);
    const taskName     = extractTaskName(folderPath) || item.replace(/-/g, ' ');
    const affectedFiles = extractAffectedFiles(folderPath);
    const keywords     = buildSearchKeywords(item, taskName, affectedFiles);
    const searchLine   = `search: ${keywords.join(', ')}\n`;

    if (dryRun) {
      console.log(`  📝 [DRY-RUN APPEND] ${item}/_index.md += search:`);
      console.log(`     ${searchLine.trim()}`);
    } else {
      fs.writeFileSync(indexPath, current.trimEnd() + '\n' + searchLine, 'utf8');
      console.log(`  🔄 ${item}/_index.md — thêm search field`);
    }
    updated++;
    continue;
  }

  // Tạo mới hoặc force overwrite
  const type         = detectType(item);
  const status       = detectStatus(folderPath);
  const taskName     = extractTaskName(folderPath) || item.replace(/-/g, ' ');
  const affectedFiles = extractAffectedFiles(folderPath);
  const risk         = extractRisk(folderPath);
  const keywords     = buildSearchKeywords(item, taskName, affectedFiles, folderPath);

  const filesBlock = affectedFiles.length > 0
    ? `files:\n${affectedFiles.map(f => `  - ${f}`).join('\n')}`
    : 'files: []';

  const content = `task: ${taskName}
type: ${type}
${filesBlock}
risk: ${risk}
status: ${status}
search: ${keywords.join(', ')}
`;

  if (dryRun) {
    console.log(`  📝 [DRY-RUN] ${item}/_index.md:`);
    console.log(content.split('\n').map(l => `     ${l}`).join('\n'));
  } else {
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`  ✅ ${item}/_index.md (status: ${status}, keywords: ${keywords.length})`);
  }
  created++;
}

console.log(`\n=== Hoàn thành ===`);
console.log(`   Tạo mới: ${created} | Cập nhật: ${updated} | Bỏ qua: ${skipped}${dryRun ? ' [DRY-RUN]' : ''}`);
