#!/usr/bin/env node

/**
 * post-ba hook — chạy sau Business Analysis.
 *
 * Nhiệm vụ:
 *   1. Tự động tạo _index.md cho task vừa phân tích (nếu chưa có).
 *   2. In ra đường dẫn spec folder để Agent biết.
 */

import fs from 'fs';
import path from 'path';
import { getConfig } from './config-loader.js';

const config = getConfig();

const taskName = process.argv[2];
const specsDir = path.join(process.cwd(), 'sk-specs');

console.log('=== [POST-BA HOOK] Chạy sau Business Analysis ===');

if (!taskName) {
  console.warn('⚠️  Không có task name — bỏ qua tạo _index.md.');
  process.exit(0);
}

const taskDir   = path.join(specsDir, taskName);
const indexPath = path.join(taskDir, '_index.md');

// Nếu task folder chưa có → Agent chưa tạo spec → bỏ qua
if (!fs.existsSync(taskDir)) {
  console.log(`ℹ️  Chưa có spec folder tại sk-specs/${taskName}. Bỏ qua.`);
  process.exit(0);
}

// Nếu _index.md đã tồn tại → không cần tạo lại
if (fs.existsSync(indexPath)) {
  console.log(`✅ _index.md đã tồn tại tại sk-specs/${taskName}/_index.md`);
  process.exit(0);
}

// ─── Tự động sinh _index.md ───────────────────────────────────────────────

function detectType(name) {
  if (name.startsWith('fix-'))      return 'bugfix';
  if (name.startsWith('refactor-')) return 'refactor';
  if (name.startsWith('optimize-')) return 'refactor';
  return 'feature';
}

function extractAffectedFiles(dir) {
  const files = new Set();
  const srcPattern = /src\/[^\s'"`,)]+\.(tsx?|jsx?|scss)/g;
  const specFiles  = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const sf of specFiles) {
    const content = fs.readFileSync(path.join(dir, sf), 'utf8');
    let match;
    while ((match = srcPattern.exec(content)) !== null) {
      files.add(match[0].replace(/['"`),]/g, '').trim());
    }
    srcPattern.lastIndex = 0;
  }
  return [...files].slice(0, 6);
}

function extractRisk(dir) {
  const candidates = ['01-bug-analysis.md', '01-feature-analysis.md', '01-refactor-analysis.md'];
  for (const f of candidates) {
    const fp = path.join(dir, f);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
    // Tìm bullet point đầu tiên dưới section risk/rủi ro
    const riskSection = content.match(/##\s+[Rr]ủi [Rr]o[^\n]*\n([\s\S]*?)(?:\n##|$)/);
    if (riskSection) {
      const bullet = riskSection[1].match(/[-*]\s+(.+)/);
      if (bullet) return bullet[1].slice(0, 120).trim();
    }
  }
  return 'Chưa xác định';
}

const STOP_WORDS = new Set(config.stopWords);

const SKIP_SEGMENTS = new Set(config.skipSegments);

function buildKeywords(folderName, affectedFiles) {
  const keywords = new Set();

  // Từ folder name
  folderName
    .replace(/^(fix|refactor|optimize|upgrade|add|remove)-/, '')
    .split('-')
    .map(s => s.toLowerCase())
    .filter(s => s.length > 2 && !STOP_WORDS.has(s))
    .forEach(k => keywords.add(k));

  // Từ file paths
  for (const f of affectedFiles) {
    f.replace(/\.(tsx?|jsx?|scss)$/, '')
      .split('/')
      .flatMap(seg => seg.split('-'))
      .map(s => s.toLowerCase())
      .filter(s =>
        s.length > 2 &&
        !SKIP_SEGMENTS.has(s) &&
        !STOP_WORDS.has(s) &&
        !/\d/.test(s) &&
        !/[àáâãèéêìíòóôõùúăđĩũơư]/.test(s)
      )
      .forEach(k => keywords.add(k));
  }

  return [...keywords].filter(k => !k.includes('.')).slice(0, 12);
}

// Detect status
let status = 'active'; // Ngay sau BA thì task luôn là active
const breakdownCandidates = ['03-task-breakdown.md', '03-fix-strategy.md', '03-risk-analysis.md'];
for (const f of breakdownCandidates) {
  const fp = path.join(taskDir, f);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');
  if (!content.includes('- [ ]') && !content.includes('- [/]')) {
    status = 'done';
    break;
  }
}

const type          = detectType(taskName);
const affectedFiles = extractAffectedFiles(taskDir);
const risk          = extractRisk(taskDir);
const keywords      = buildKeywords(taskName, affectedFiles);

const filesBlock = affectedFiles.length > 0
  ? `files:\n${affectedFiles.map(f => `  - ${f}`).join('\n')}`
  : 'files: []';

const content = `task: ${taskName.replace(/-/g, ' ')}
type: ${type}
${filesBlock}
risk: ${risk}
status: ${status}
search: ${keywords.join(', ')}
`;

fs.writeFileSync(indexPath, content, 'utf8');

console.log(`\n✅ Đã tạo _index.md cho task "${taskName}"`);
console.log(`   → sk-specs/${taskName}/_index.md`);
console.log(`   status: ${status} | keywords: ${keywords.length}`);

// ─── Cập nhật spec-registry.json ───────────────────────────────────────────
try {
  const registryPath = path.join(process.cwd(), '.cache', 'spec-registry.json');
  let registry = { specs: {}, features: {} };

  // Đảm bảo thư mục .cache tồn tại
  const registryDir = path.dirname(registryPath);
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }

  if (fs.existsSync(registryPath)) {
    try {
      registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    } catch (e) {
      console.warn('⚠️  Lỗi đọc spec-registry.json khi cập nhật, registry sẽ được khởi tạo lại.');
    }
  }

  // Hàm suy luận feature nghiệp vụ
  function inferFeature(specName, indexContent) {
    const match = indexContent.match(/^feature:\s*(\S+)/m);
    if (match && match[1].trim()) {
      return match[1].trim().toLowerCase();
    }
    const name = specName.toLowerCase();
    const featureKeywords = config.featureKeywords;
    for (const kw of featureKeywords) {
      if (name.includes(kw)) return kw;
    }
    return '';
  }

  const specFeature = inferFeature(taskName, content);

  // Thêm/cập nhật spec mới vào registry
  registry.specs[taskName] = {
    task: taskName.replace(/-/g, ' '),
    type,
    feature: specFeature,
    status,
    keywords,
    files: affectedFiles,
    indexContent: content
  };

  // Đồng bộ sang features map
  if (specFeature) {
    if (!registry.features[specFeature]) {
      registry.features[specFeature] = { activeSpecs: [], completedSpecs: [], relatedKeywords: [] };
    }

    // Xóa spec khỏi cả hai danh sách trước khi push lại (để tránh trùng lặp)
    registry.features[specFeature].activeSpecs = registry.features[specFeature].activeSpecs.filter(item => item !== taskName);
    registry.features[specFeature].completedSpecs = registry.features[specFeature].completedSpecs.filter(item => item !== taskName);

    const targetArr = (status === 'done' || status === 'cancelled')
      ? registry.features[specFeature].completedSpecs
      : registry.features[specFeature].activeSpecs;

    targetArr.push(taskName);

    // Cập nhật keywords liên quan
    const currentRelated = new Set(registry.features[specFeature].relatedKeywords);
    keywords.forEach(kw => currentRelated.add(kw));
    registry.features[specFeature].relatedKeywords = [...currentRelated];
  }

  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');
  console.log(`✅ Đã đồng bộ spec mới "${taskName}" vào spec-registry.json`);
} catch (error) {
  console.error('⚠️  Không thể cập nhật spec-registry.json:', error.message);
}

console.log('\n=== [POST-BA HOOK] Hoàn thành ===\n');

process.exit(0);
