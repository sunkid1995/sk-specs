#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Xác định thư mục nguồn (thư mục của package sk-specs)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname);

// Xác định thư mục đích (thư mục hiện hành nơi chạy npx - Client Project)
const clientDir = process.cwd();

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
    fs.mkdirSync(targetAgentsDir, { recursive: true });
}

// Hàm copy đè đệ quy thư mục
function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
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

// Đồng bộ bản sao repo sk-specs vào sk-specs/
const targetSkSpecsDir = path.join(targetAgentsDir, 'sk-specs');

// Kiểm tra xem có phải đang chạy trực tiếp từ trong thư mục .agents/sk-specs của client không
if (srcDir === targetSkSpecsDir) {
    console.log("- Đang chạy trực tiếp từ thư mục .agents/sk-specs của dự án client. Không cần tự nhân bản.");
} else {
    console.log("Đang đồng bộ cấu hình sk-specs vào sk-specs/...");
    fs.mkdirSync(targetSkSpecsDir, { recursive: true });

    // Copy các file tĩnh của repo vào sk-specs/
    const staticFiles = ['README.md', 'PROJECT_STRUCTURE.md', 'sync-agents.sh', 'sync.js', 'package.json'];
    for (let file of staticFiles) {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(targetSkSpecsDir, file);
        if (fs.existsSync(srcFile)) {
            fs.copyFileSync(srcFile, destFile);
        }
    }

    // Sao chép các thư mục rules, skills, workflows, templates vào trong sk-specs/
    const subFoldersToCopy = ['rules', 'skills', 'workflows', 'templates'];
    for (let folder of subFoldersToCopy) {
        const srcFolder = path.join(srcDir, folder);
        const destFolder = path.join(targetSkSpecsDir, folder);
        if (fs.existsSync(destFolder)) {
            fs.rmSync(destFolder, { recursive: true, force: true });
        }
        copyDirSync(srcFolder, destFolder);
        console.log(`- Đã đồng bộ thư mục sk-specs/${folder}/`);
    }

    // Đồng bộ các file trong commands/ ra .agents/skills/ trực tiếp để Antigravity nhận dạng Slash Commands
    const targetSkillsDir = path.join(targetAgentsDir, 'skills');
    if (fs.existsSync(targetSkillsDir)) {
        fs.rmSync(targetSkillsDir, { recursive: true, force: true });
    }
    const srcCommandsFolder = path.join(srcDir, 'commands');
    if (fs.existsSync(srcCommandsFolder)) {
        copyDirSync(srcCommandsFolder, targetSkillsDir);
        console.log("- Đã đồng bộ các file Custom Commands ra .agents/skills/ (Slash Commands)");
    }
}

// Khởi tạo các thư mục tiến độ rỗng nếu chưa tồn tại tại root của client workspace
const clientSkSpecsDir = path.join(clientDir, 'sk-specs');
const progressFolders = ['active', 'completed', 'archived'];
for (let folder of progressFolders) {
    const folderPath = path.join(clientSkSpecsDir, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}
console.log("- Đã đảm bảo các thư mục active/, completed/, archived/ tồn tại tại root của client workspace");

// Khởi tạo thư mục sk-specs/hooks/ nếu chưa tồn tại tại client workspace
const clientHooksDir = path.join(clientSkSpecsDir, 'hooks');
if (!fs.existsSync(clientHooksDir)) {
    console.log("- Thư mục sk-specs/hooks/ chưa tồn tại. Tiến hành khởi tạo...");
    fs.mkdirSync(clientHooksDir, { recursive: true });
}

// Sao chép các tệp script mẫu từ templates/hooks sang sk-specs/hooks nếu chưa có
const srcHooksTemplatesDir = path.join(srcDir, 'templates', 'hooks');
if (fs.existsSync(srcHooksTemplatesDir)) {
    const hookTemplates = fs.readdirSync(srcHooksTemplatesDir);
    for (let hookTemplate of hookTemplates) {
        const srcTemplatePath = path.join(srcHooksTemplatesDir, hookTemplate);
        const targetHookPath = path.join(clientHooksDir, hookTemplate);
        
        // Không ghi đè nếu tệp hook đích đã tồn tại để bảo vệ tùy chỉnh của user
        if (!fs.existsSync(targetHookPath)) {
            fs.copyFileSync(srcTemplatePath, targetHookPath);
            console.log(`  * Khởi tạo hook mẫu: sk-specs/hooks/${hookTemplate}`);
        }
    }
}

// Cấp quyền thực thi cho các script nếu chạy trên macOS/Linux
if (process.platform !== 'win32') {
    try {
        fs.chmodSync(path.join(targetSkSpecsDir, 'sync-agents.sh'), '755');
        fs.chmodSync(path.join(targetSkSpecsDir, 'sync.js'), '755');
        
        // Cấp quyền thực thi cho các file trong sk-specs/hooks/
        if (fs.existsSync(clientHooksDir)) {
            const hookFiles = fs.readdirSync(clientHooksDir);
            for (let file of hookFiles) {
                fs.chmodSync(path.join(clientHooksDir, file), '755');
            }
        }
    } catch (e) {
        // Bỏ qua lỗi phân quyền nếu không đủ quyền
    }
}

console.log("Đồng bộ cấu hình quy trình phát triển phần mềm hoàn tất thành công!");
