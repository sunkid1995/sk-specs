#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Xác định thư mục nguồn (thư mục của package sk-specs)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname);

// Xác định thư mục đích (thư mục hiện hành nơi chạy npx - Client Project)
const clientDir = process.cwd();

// Kiểm tra chế độ --dry-run
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
    console.log("🔍 CHẾ ĐỘ DRY-RUN: Chỉ hiển thị các thay đổi sẽ được thực hiện, KHÔNG ghi file.\n");
}

console.log("Bắt đầu đồng bộ cấu hình quy trình phát triển phần mềm...");
console.log(`Thư mục nguồn (sk-specs): ${srcDir}`);
console.log(`Thư mục đích (Client): ${clientDir}`);

// Xác định đường dẫn .agents đích
const targetAgentsDir = path.join(clientDir, '.agents');

// Kiểm tra sự tồn tại của thư mục .agents ở client
if (fs.existsSync(targetAgentsDir)) {
    console.log("- Tìm thấy thư mục .agents/ đã có sẵn tại dự án client.");
} else {
    console.log("- Thư mục .agents/ chưa tồn tại. Tiến hành khởi tạo thư mục .agents/ mới...");
    dryMkdir(targetAgentsDir);
}

// Hàm copy đè đệ quy thư mục
function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
    if (isDryRun) {
        console.log(`  [DRY-RUN] Sẽ copy thư mục: ${src} → ${dest}`);
        return;
    }
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        // Bỏ qua các thư mục không cần thiết
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'test-client-project') {
            continue;
        }
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Các hàm helper cho dry-run mode
function dryMkdir(dirPath) {
    if (isDryRun) {
        if (!fs.existsSync(dirPath)) {
            console.log(`  [DRY-RUN] Sẽ tạo thư mục: ${dirPath}`);
        }
        return;
    }
    fs.mkdirSync(dirPath, { recursive: true });
}

function dryCopy(src, dest) {
    if (isDryRun) {
        console.log(`  [DRY-RUN] Sẽ copy file: ${path.basename(src)} → ${dest}`);
        return;
    }
    fs.copyFileSync(src, dest);
}

function dryRm(targetPath) {
    if (isDryRun) {
        if (fs.existsSync(targetPath)) {
            console.log(`  [DRY-RUN] Sẽ xóa: ${targetPath}`);
        }
        return;
    }
    fs.rmSync(targetPath, { recursive: true, force: true });
}

function dryWriteFile(filePath, content, encoding = 'utf8') {
    if (isDryRun) {
        console.log(`  [DRY-RUN] Sẽ ghi file: ${filePath}`);
        return;
    }
    fs.writeFileSync(filePath, content, encoding);
}

function dryChmod(filePath, mode) {
    if (isDryRun) {
        console.log(`  [DRY-RUN] Sẽ phân quyền ${mode} cho: ${filePath}`);
        return;
    }
    fs.chmodSync(filePath, mode);
}

// Đồng bộ bản sao repo sk-specs vào sk-specs/
const targetSkSpecsDir = path.join(targetAgentsDir, 'sk-specs');

// Kiểm tra xem có phải đang chạy trực tiếp từ trong thư mục .agents/sk-specs của client không
if (srcDir === targetSkSpecsDir) {
    console.log("- Đang chạy trực tiếp từ thư mục .agents/sk-specs của dự án client. Không cần tự nhân bản.");
} else {
    console.log("Đang đồng bộ cấu hình sk-specs vào sk-specs/...");
    dryMkdir(targetSkSpecsDir);

    // Copy các file tĩnh của repo vào sk-specs/
    const staticFiles = ['README.md', 'PROJECT_STRUCTURE.md', 'sync-agents.sh', 'sync.js', 'package.json'];
    for (let file of staticFiles) {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(targetSkSpecsDir, file);
        if (fs.existsSync(srcFile)) {
            dryCopy(srcFile, destFile);
        }
    }

    // Sao chép các thư mục rules, skills, workflows, templates vào trong sk-specs/
    const subFoldersToCopy = ['rules', 'skills', 'workflows', 'templates'];
    for (let folder of subFoldersToCopy) {
        const srcFolder = path.join(srcDir, folder);
        const destFolder = path.join(targetSkSpecsDir, folder);
        if (fs.existsSync(destFolder)) {
            dryRm(destFolder);
        }
        copyDirSync(srcFolder, destFolder);
        console.log(`- Đã đồng bộ thư mục sk-specs/${folder}/`);
    }

    // Đồng bộ các file trong commands/ ra .agents/skills/ trực tiếp để Antigravity nhận dạng Slash Commands
    // CHỈ xóa và ghi đè các thư mục có prefix 'sk-' để bảo vệ skills riêng của client
    const targetSkillsDir = path.join(targetAgentsDir, 'skills');
    dryMkdir(targetSkillsDir);

    // Xóa chỉ các thư mục sk-* đã tồn tại trong .agents/skills/
    if (fs.existsSync(targetSkillsDir)) {
        const existingSkills = fs.readdirSync(targetSkillsDir, { withFileTypes: true });
        for (let entry of existingSkills) {
            if (entry.isDirectory() && entry.name.startsWith('sk-')) {
                dryRm(path.join(targetSkillsDir, entry.name));
            }
        }
    }

    // Copy các thư mục sk-* từ commands/ vào .agents/skills/
    const srcCommandsFolder = path.join(srcDir, 'commands');
    if (fs.existsSync(srcCommandsFolder)) {
        const commandEntries = fs.readdirSync(srcCommandsFolder, { withFileTypes: true });
        for (let entry of commandEntries) {
            if (entry.isDirectory() && entry.name.startsWith('sk-')) {
                copyDirSync(
                    path.join(srcCommandsFolder, entry.name),
                    path.join(targetSkillsDir, entry.name)
                );
            }
        }
        console.log("- Đã đồng bộ các Slash Commands (sk-*) vào .agents/skills/ (giữ nguyên skills riêng của client)");
    }
}

// Khởi tạo các thư mục tiến độ rỗng nếu chưa tồn tại tại root của client workspace
const clientSkSpecsDir = path.join(clientDir, 'sk-specs');
const progressFolders = ['active', 'completed', 'archived'];
for (let folder of progressFolders) {
    const folderPath = path.join(clientSkSpecsDir, folder);
    if (!fs.existsSync(folderPath)) {
        dryMkdir(folderPath);
    }
}
console.log("- Đã đảm bảo các thư mục active/, completed/, archived/ tồn tại tại root của client workspace");

// Khởi tạo thư mục sk-specs/hooks/ nếu chưa tồn tại tại client workspace
const clientHooksDir = path.join(clientSkSpecsDir, 'hooks');
if (!fs.existsSync(clientHooksDir)) {
    console.log("- Thư mục sk-specs/hooks/ chưa tồn tại. Tiến hành khởi tạo...");
    dryMkdir(clientHooksDir);
}

// Sao chép các tệp script mẫu từ hooks sang sk-specs/hooks với cơ chế version/hash
function computeFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
}

const srcHooksDir = path.join(srcDir, 'hooks');
const manifestPath = path.join(clientHooksDir, '.hooks-manifest.json');

// Đọc manifest hiện tại (nếu có)
let manifest = {};
if (fs.existsSync(manifestPath)) {
    try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
        manifest = {};
    }
}

if (fs.existsSync(srcHooksDir)) {
    const hookFiles = fs.readdirSync(srcHooksDir).filter(f => !f.startsWith('.'));
    for (let hookFile of hookFiles) {
        const srcHookPath = path.join(srcHooksDir, hookFile);
        const targetHookPath = path.join(clientHooksDir, hookFile);
        const newUpstreamHash = computeFileHash(srcHookPath);

        if (!fs.existsSync(targetHookPath)) {
            // Hook chưa tồn tại → copy mới
            dryCopy(srcHookPath, targetHookPath);
            manifest[hookFile] = { upstreamHash: newUpstreamHash };
            console.log(`  * Khởi tạo hook mẫu: sk-specs/hooks/${hookFile}`);
        } else {
            // Hook đã tồn tại → kiểm tra version
            const oldUpstreamHash = manifest[hookFile]?.upstreamHash;

            if (oldUpstreamHash === newUpstreamHash) {
                // Upstream không thay đổi → bỏ qua
                continue;
            }

            // Upstream đã thay đổi → kiểm tra client có customize không
            const currentClientHash = computeFileHash(targetHookPath);

            if (currentClientHash === oldUpstreamHash) {
                // Client CHƯA customize (hash giống upstream cũ) → tự động cập nhật
                dryCopy(srcHookPath, targetHookPath);
                manifest[hookFile] = { upstreamHash: newUpstreamHash };
                console.log(`  * Cập nhật hook: sk-specs/hooks/${hookFile} (upstream mới)`);
            } else {
                // Client ĐÃ customize → tạo file .upstream để merge thủ công
                const upstreamFilePath = path.join(clientHooksDir, `${hookFile}.upstream`);
                dryCopy(srcHookPath, upstreamFilePath);
                manifest[hookFile] = { ...manifest[hookFile], pendingUpstreamHash: newUpstreamHash };
                console.warn(`  ⚠️  Hook '${hookFile}' đã được tùy chỉnh tại client. Bản cập nhật mới lưu tại: ${hookFile}.upstream`);
                console.warn(`     -> Vui lòng merge thủ công và xóa file .upstream sau khi hoàn tất.`);
            }
        }
    }

    // Ghi lại manifest
    dryWriteFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}

// Cấp quyền thực thi cho các script nếu chạy trên macOS/Linux
if (process.platform !== 'win32') {
    try {
        dryChmod(path.join(targetSkSpecsDir, 'sync-agents.sh'), '755');
        dryChmod(path.join(targetSkSpecsDir, 'sync.js'), '755');
        
        // Cấp quyền thực thi cho các file trong sk-specs/hooks/
        if (fs.existsSync(clientHooksDir)) {
            const hookFiles = fs.readdirSync(clientHooksDir);
            for (let file of hookFiles) {
                dryChmod(path.join(clientHooksDir, file), '755');
            }
        }
    } catch (e) {
        // Bỏ qua lỗi phân quyền nếu không đủ quyền
    }
}

console.log("Đồng bộ cấu hình quy trình phát triển phần mềm hoàn tất thành công!");
