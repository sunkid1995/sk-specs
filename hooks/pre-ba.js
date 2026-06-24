#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { getConfig } from './config-loader.js';

const config = getConfig();

const currentTask = process.argv[2];
const specsDir = path.join(process.cwd(), 'sk-specs');

function checkSimpleTweak(taskName) {
  if (!taskName) return false;
  
  const name = taskName.toLowerCase().trim().replace(/_/g, '-');
  
  const tweakPatterns = config.tweakPatterns.map(p => new RegExp(p));

  if (name.startsWith('style/') || name.startsWith('chore/')) {
    const logicalKeywords = ['api', 'store', 'state', 'auth', 'logic', 'database', 'service', 'hook'];
    return !logicalKeywords.some(kw => name.includes(kw));
  }

  return tweakPatterns.some(pattern => pattern.test(name));
}

console.log('=== Running pre-ba Hook ===');

if (currentTask && checkSimpleTweak(currentTask)) {
  console.log('\nℹ️  [SIMPLE TWEAK DETECTED] Task này được xác định là chỉnh sửa nhỏ (Simple Tweak):');
  console.log('   - Sửa text/label/i18n string');
  console.log('   - Sửa style đơn giản (CSS/SCSS/spacing/color)');
  console.log('   - Thêm/xóa comment, format code, hoặc debug log');
  console.log('\n👉 CHỈ THỊ CHO AGENT:');
  console.log('   Theo quy tắc core-rules.md, KHÔNG cần tạo folder spec, BA hoặc Technical Design.');
  console.log('   Agent hãy BỎ QUA việc tạo spec mới và đi thẳng vào thực hiện chỉnh sửa code.');
  console.log('============================================\n');
  process.exit(0);
}

if (!fs.existsSync(specsDir)) {
  console.log('Directory sk-specs does not exist. Skipping check.');
  process.exit(0);
}

// ─── Helpers: Parse _index.md ─────────────────────────────────────────────────

function readIndex(specDir) {
  const indexPath = path.join(specDir, '_index.md');
  if (!fs.existsSync(indexPath)) return null;
  try {
    return fs.readFileSync(indexPath, 'utf8').trim();
  } catch {
    return null;
  }
}

function parseIndexFiles(content) {
  const lines = content.split('\n');
  const files = [];
  let inFiles = false;
  for (const line of lines) {
    if (line.trim().startsWith('files:')) { inFiles = true; continue; }
    if (inFiles) {
      if (line.trim().startsWith('- ')) {
        files.push(line.trim().slice(2).trim());
      } else if (line.trim() && !line.startsWith(' ') && !line.startsWith('\t')) {
        inFiles = false;
      }
    }
  }
  return files;
}

function parseIndexStatus(content) {
  const match = content.match(/^status:\s*(\S+)/m);
  return match ? match[1] : 'unknown';
}

function parseIndexTask(content) {
  const match = content.match(/^task:\s*(.+)/m);
  return match ? match[1].trim() : '';
}

/** Parse trường `search:` từ _index.md — trả về Set<string> keyword. Fallback về task name/title nếu trống */
function parseIndexSearch(content, taskName = '') {
  const match = content.match(/^search:\s*(.+)/m);
  if (match && match[1].trim()) {
    return new Set(
      match[1].split(',').map(k => k.trim().toLowerCase()).filter(Boolean)
    );
  }
  const taskTitle = parseIndexTask(content) || taskName;
  return new Set(extractKeywordsFromName(taskTitle));
}

/** Suy luận Feature nghiệp vụ chính của spec dựa trên metadata hoặc tên folder */
function inferFeatureFromSpec(specName, indexContent) {
  if (!specName) return '';
  const match = indexContent ? indexContent.match(/^feature:\s*(\S+)/m) : null;
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

const CORE_BUSINESS_CONCEPTS = new Set(config.coreBusinessConcepts);

const SYNONYM_MAP = config.synonymMap;

function stemWord(word) {
  let w = word.toLowerCase().trim();
  if (w.endsWith('ing')) {
    w = w.slice(0, -3);
  } else if (w.endsWith('ed')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('ies')) {
    w = w.slice(0, -3) + 'y';
  } else if (w.endsWith('es') && !w.endsWith('aes') && !w.endsWith('ees') && !w.endsWith('oes')) {
    w = w.slice(0, -2);
  } else if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is') && !w.endsWith('as')) {
    w = w.slice(0, -1);
  }
  return w;
}

function normalizeKeywords(keywordSet) {
  const normalized = new Set();
  for (const kw of keywordSet) {
    const stemmed = stemWord(kw);
    if (SYNONYM_MAP[stemmed]) {
      normalized.add(SYNONYM_MAP[stemmed]);
    } else {
      normalized.add(stemmed);
    }
  }
  return normalized;
}

/**
 * Tính toán độ tương đồng ngữ nghĩa nâng cao giữa 2 tập keyword.
 * Kết hợp Jaccard Score, Overlap Coefficient, và cộng thêm trọng số nếu trùng khớp Core Concept nghiệp vụ.
 */
function semanticSimilarity(setA, setB) {
  const normA = normalizeKeywords(setA);
  const normB = normalizeKeywords(setB);
  if (normA.size === 0 || normB.size === 0) return 0;

  const intersection = [...normA].filter(k => normB.has(k));
  const intersectionSize = intersection.length;
  
  const jaccard = intersectionSize / new Set([...normA, ...normB]).size;
  const overlap = intersectionSize / Math.min(normA.size, normB.size);
  
  const hasCoreOverlap = intersection.some(k => CORE_BUSINESS_CONCEPTS.has(k));
  
  let score = 0.4 * jaccard + 0.6 * overlap;
  if (hasCoreOverlap) {
    score += 0.15;
  }
  
  return Math.min(score, 1.0);
}

// ─── Helpers: Keyword extraction từ task name ─────────────────────────────────

const STOP_WORDS = new Set(config.stopWords);

/**
 * Trích xuất keywords từ task name (dạng kebab-case hoặc text tự do).
 * Dùng để match với search field của các spec hiện có.
 */
function extractKeywordsFromName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(s =>
      s.length > 2 &&
      !STOP_WORDS.has(s) &&
      !/\d{4}/.test(s) &&
      !/[àáâãèéêìíòóôõùúăđĩũơư]/.test(s)
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function rebuildRegistryFromFiles(specsDir) {
  const registry = { specs: {}, features: {} };
  let items = [];
  try {
    items = fs.readdirSync(specsDir).filter(item => {
      try {
        return fs.statSync(path.join(specsDir, item)).isDirectory();
      } catch {
        return false;
      }
    });
  } catch (e) {
    return registry;
  }

  for (const item of items) {
    const itemPath = path.join(specsDir, item);
    const indexContent = readIndex(itemPath);
    if (!indexContent) continue;

    const task = parseIndexTask(indexContent);
    const type = indexContent.match(/^type:\s*(\S+)/m)?.[1] || 'feature';
    const status = parseIndexStatus(indexContent);
    const files = parseIndexFiles(indexContent);
    
    const keywords = [...parseIndexSearch(indexContent, item)];
    const feature = inferFeatureFromSpec(item, indexContent);

    registry.specs[item] = { task, type, feature, status, keywords, files, indexContent };

    if (feature) {
      if (!registry.features[feature]) {
        registry.features[feature] = { activeSpecs: [], completedSpecs: [], relatedKeywords: [] };
      }
      const targetArr = (status === 'done' || status === 'cancelled') 
        ? registry.features[feature].completedSpecs 
        : registry.features[feature].activeSpecs;
      if (!targetArr.includes(item)) targetArr.push(item);

      const currentRelated = new Set(registry.features[feature].relatedKeywords);
      keywords.forEach(kw => currentRelated.add(kw));
      registry.features[feature].relatedKeywords = [...currentRelated];
    }
  }
  return registry;
}

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
      console.warn('⚠️  Lỗi đọc spec-registry.json, tiến hành quét lại toàn bộ sk-specs/.');
      registry = rebuildRegistryFromFiles(specsDir);
      try { fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8'); } catch {}
    }
  } else {
    console.log('ℹ️  spec-registry.json chưa tồn tại. Tiến hành khởi tạo registry...');
    registry = rebuildRegistryFromFiles(specsDir);
    try {
      fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');
      console.log('✅ Đã tạo tệp .cache/spec-registry.json tập trung.');
    } catch (e) {
      console.error('Không thể ghi spec-registry.json:', e.message);
    }
  }

  // Nếu không truyền currentTask, chúng ta chỉ cần rebuild/kiểm tra registry rồi kết thúc
  if (!currentTask) {
    console.log('✅ Đã kiểm tra và cập nhật spec-registry.json thành công.');
    process.exit(0);
  }

  const currentTaskDir   = path.join(specsDir, currentTask);
  const currentTaskExists = fs.existsSync(currentTaskDir);
  const currentTaskIndex  = currentTaskExists ? readIndex(currentTaskDir) : null;
  const currentFiles      = currentTaskIndex ? parseIndexFiles(currentTaskIndex) : [];
  const currentKeywords   = currentTaskIndex
    ? parseIndexSearch(currentTaskIndex, currentTask)
    : new Set(extractKeywordsFromName(currentTask));

  // ─── Block A: Task chưa có spec folder → tìm specs tương đồng ─────────────

  if (currentTask && !currentTaskExists) {
    console.log(`\nℹ️  Chưa có spec cho task "${currentTask}".`);
    console.log(`   Đang tìm specs tương đồng để xác nhận...\n`);

    const similarSpecs = [];

    for (const [name, spec] of Object.entries(registry.specs)) {
      const theirKeywords = new Set(spec.keywords);
      const score = semanticSimilarity(currentKeywords, theirKeywords);
      if (score >= 0.20) {
        similarSpecs.push({
          name,
          score,
          task: spec.task,
          status: spec.status,
          indexContent: spec.indexContent,
        });
      }
    }

    similarSpecs.sort((a, b) => b.score - a.score);
    const topSpecs = similarSpecs.slice(0, 5);

    if (topSpecs.length > 0) {
      console.log('\x1b[33m%s\x1b[0m', '⚠️  [CẦN XÁC NHẬN] Phát hiện specs có thể liên quan đến yêu cầu này:');
      console.log('\x1b[33m%s\x1b[0m', '─'.repeat(60));

      topSpecs.forEach((s, i) => {
        const statusBadge = s.status === 'done' ? '✅ done' : `🟡 ${s.status}`;
        console.log(`\n  ${i + 1}. 📁 sk-specs/${s.name}/`);
        console.log(`     task   : ${s.task}`);
        console.log(`     status : ${statusBadge}`);
        console.log(`     score  : ${(s.score * 100).toFixed(0)}% tương đồng ngữ nghĩa`);
        const theirKeywords = new Set(registry.specs[s.name].keywords);
        const overlap = [...currentKeywords].filter(k => theirKeywords.has(k));
        if (overlap.length > 0) {
          console.log(`     overlap: ${overlap.join(', ')}`);
        }
      });

      console.log('\n' + '─'.repeat(60));
      console.log('\x1b[33m%s\x1b[0m', '\n→ YÊU CẦU AGENT: Trước khi tạo folder spec mới, hãy hỏi user:');
      console.log('  "Yêu cầu này là CẬP NHẬT spec đã có hay tạo FEATURE/BUG/REFACTOR MỚI hoàn toàn?"');
      console.log('  Nếu là cập nhật → bổ sung vào spec folder đã có (không tạo folder mới).');
      console.log('  Nếu là mới      → xác nhận với user rồi mới tạo sk-specs/' + currentTask + '/\n');

      process.exit(2);
    } else {
      console.log(`✅ Không tìm thấy spec tương đồng.`);
      console.log('\n\x1b[33m%s\x1b[0m', '⚠️  [CẦN XÁC NHẬN] Chưa có folder spec cho task này:');
      console.log('\x1b[33m%s\x1b[0m', '─'.repeat(60));
      console.log('\x1b[33m%s\x1b[0m', '\n→ YÊU CẦU AGENT: Trước khi tạo folder spec mới, bạn BẮT BUỘC phải hỏi user:');
      console.log(`  "Yêu cầu này có phải là một Feature, Bugfix, hoặc Refactor mới cần tạo folder spec sk-specs/${currentTask}/ hay không?"`);
      console.log('  Nếu user đồng ý → tiến hành tạo folder.');
      console.log('  Nếu user không đồng ý hoặc muốn làm tweak nhỏ → đi thẳng vào sửa code không tạo folder.');
      console.log('\n' + '─'.repeat(60) + '\n');
      
      process.exit(2);
    }
  }

  // ─── Block B: Kiểm tra conflict với task đang active ─────────────────────

  if (currentTaskIndex) {
    console.log(`\n📋 [SPEC] Task hiện tại: ${currentTask}`);
    console.log('─'.repeat(50));
    console.log(currentTaskIndex);
    console.log('─'.repeat(50));
  }

  const activeTasks = [];

  for (const [name, spec] of Object.entries(registry.specs)) {
    if (name === currentTask) continue;
    if (spec.status === 'done' || spec.status === 'cancelled') continue;

    activeTasks.push({
      name,
      indexContent: spec.indexContent,
      feature: spec.feature,
      files: spec.files,
      keywords: new Set(spec.keywords)
    });
  }

  if (activeTasks.length === 0) {
    console.log('\n✅ Không phát hiện task nào đang active song song.');
    process.exit(0);
  }

  const conflictTasks = activeTasks.filter(t => {
    // 1. File path overlap
    const hasFileOverlap = currentFiles.length > 0 && t.files.length > 0 &&
      t.files.some(f => currentFiles.some(cf => cf === f || f.includes(cf) || cf.includes(f)));
    if (hasFileOverlap) {
      t.conflictReason = 'file-overlap';
      return true;
    }

    // 2. Feature overlap
    const currentFeature = inferFeatureFromSpec(currentTask, currentTaskIndex || '');
    if (currentFeature && t.feature && currentFeature === t.feature) {
      t.conflictReason = `feature-overlap (feature: ${currentFeature})`;
      return true;
    }

    // 3. Keyword similarity
    const score = semanticSimilarity(currentKeywords, t.keywords);
    if (score >= 0.15) {
      t.conflictReason = `keyword-similarity (score: ${(score * 100).toFixed(0)}%)`;
      return true;
    }

    return false;
  });

  const nonConflictTasks = activeTasks.filter(t => !conflictTasks.includes(t));

  if (conflictTasks.length > 0) {
    console.warn('\n\x1b[31m%s\x1b[0m', '⚠️  [CONFLICT] Phát hiện task active có thể liên quan:');
    conflictTasks.forEach(t => {
      const reason = t.conflictReason || 'unknown';
      console.warn(`\n  📁 ${t.name}  [${reason}]`);
      if (t.indexContent) {
        const lines = t.indexContent.split('\n').map(l => `     ${l}`).join('\n');
        console.warn(lines);
      }
    });
    console.warn('\n\x1b[31m%s\x1b[0m', '→ Kiểm tra conflict trước khi viết code!\n');
  }

  if (nonConflictTasks.length > 0) {
    console.warn('\x1b[33m%s\x1b[0m', `ℹ️  ${nonConflictTasks.length} task active khác (không conflict): ${nonConflictTasks.map(t => t.name).join(', ')}`);
  }

  process.exit(0);
} catch (error) {
  console.error('Lỗi khi chạy pre-ba hook:', error.message);
  process.exit(0);
}
