#!/bin/bash

# Kiểm tra đối số đầu vào
if [ -z "$1" ]; then
    echo "Lỗi: Vui lòng cung cấp đường dẫn đến dự án client."
    echo "Sử dụng: $0 <duong-dan-du-an-client>"
    exit 1
fi

CLIENT_DIR="$1"
DRY_RUN=false

# Kiểm tra flag --dry-run
for arg in "$@"; do
    if [ "$arg" = "--dry-run" ]; then
        DRY_RUN=true
    fi
done

if [ "$DRY_RUN" = true ]; then
    echo "🔍 CHẾ ĐỘ DRY-RUN: Chỉ hiển thị các thay đổi sẽ được thực hiện, KHÔNG ghi file."
    echo ""
fi

# Định nghĩa các hàm helper cho dry-run mode
dry_mkdir() {
    if [ "$DRY_RUN" = true ]; then
        echo "  [DRY-RUN] Sẽ tạo thư mục: $1"
    else
        mkdir -p "$1"
    fi
}

dry_cp() {
    local src="$1"
    local dest="$2"
    if [ "$DRY_RUN" = true ]; then
        echo "  [DRY-RUN] Sẽ copy file: $(basename "$src") → $dest"
    else
        cp "$src" "$dest" 2>/dev/null
    fi
}

dry_cp_r() {
    local src="$1"
    local dest="$2"
    if [ "$DRY_RUN" = true ]; then
        echo "  [DRY-RUN] Sẽ copy thư mục: $(basename "$src") → $dest"
    else
        cp -R "$src" "$dest"
    fi
}

dry_rm_rf() {
    if [ "$DRY_RUN" = true ]; then
        echo "  [DRY-RUN] Sẽ xóa: $1"
    else
        rm -rf "$1"
    fi
}

dry_chmod() {
    if [ "$DRY_RUN" = true ]; then
        echo "  [DRY-RUN] Sẽ phân quyền $1 cho: $2"
    else
        chmod "$1" "$2" 2>/dev/null
    fi
}


# Kiểm tra thư mục client có tồn tại không
if [ ! -d "$CLIENT_DIR" ]; then
    echo "Lỗi: Thư mục '$CLIENT_DIR' không tồn tại hoặc không phải là một thư mục."
    exit 1
fi

# Xác định đường dẫn tuyệt đối của dự án client và script nguồn
CLIENT_DIR_ABS=$(cd "$CLIENT_DIR" && pwd)
SCRIPT_DIR_ABS=$(cd "$(dirname "$0")" && pwd)

# Xác định thư mục .agents đích thực tế để tránh trùng lặp .agents/.agents
if [[ "$CLIENT_DIR_ABS" == */.agents ]] || [[ "$CLIENT_DIR_ABS" == */.agents/ ]]; then
    TARGET_AGENTS_DIR="${CLIENT_DIR_ABS%/}"
else
    TARGET_AGENTS_DIR="$CLIENT_DIR_ABS/.agents"
fi

echo "Bắt đầu đồng bộ cấu hình quy trình phát triển phần mềm..."
echo "Thư mục nguồn (sk-specs): $SCRIPT_DIR_ABS"
echo "Thư mục đích (Client .agents/): $TARGET_AGENTS_DIR"

# Kiểm tra sự tồn tại của thư mục .agents ở client và hiển thị log phù hợp
if [ -d "$TARGET_AGENTS_DIR" ]; then
    echo "- Tìm thấy thư mục .agents/ đã có sẵn tại dự án client."
else
    echo "- Thư mục .agents/ chưa tồn tại. Tiến hành khởi tạo thư mục .agents/ mới..."
    dry_mkdir "$TARGET_AGENTS_DIR"
fi

# Kiểm tra xem có đang chạy trực tiếp từ trong thư mục .agents/sk-specs của client hay không
if [ "$SCRIPT_DIR_ABS" = "$TARGET_AGENTS_DIR/sk-specs" ]; then
    echo "- Đang chạy trực tiếp từ thư mục .agents/sk-specs của dự án client. Không cần tự nhân bản."
else
    # Đồng bộ bản sao của toàn bộ repo sk-specs vào trong TARGET_AGENTS_DIR/sk-specs/
    echo "Đang đồng bộ cấu hình sk-specs vào sk-specs/..."
    dry_mkdir "$TARGET_AGENTS_DIR/sk-specs"

    # Copy các file tĩnh
    dry_cp "$SCRIPT_DIR_ABS/README.md" "$TARGET_AGENTS_DIR/sk-specs/"
    dry_cp "$SCRIPT_DIR_ABS/PROJECT_STRUCTURE.md" "$TARGET_AGENTS_DIR/sk-specs/"
    dry_cp "$SCRIPT_DIR_ABS/sync-agents.sh" "$TARGET_AGENTS_DIR/sk-specs/"
    dry_cp "$SCRIPT_DIR_ABS/sync.js" "$TARGET_AGENTS_DIR/sk-specs/"
    dry_cp "$SCRIPT_DIR_ABS/package.json" "$TARGET_AGENTS_DIR/sk-specs/"
    dry_chmod +x "$TARGET_AGENTS_DIR/sk-specs/sync-agents.sh"
    dry_chmod +x "$TARGET_AGENTS_DIR/sk-specs/sync.js"


    # Copy các thư mục cấu hình và templates vào sk-specs/
    dry_rm_rf "$TARGET_AGENTS_DIR/sk-specs/rules"
    dry_cp_r "$SCRIPT_DIR_ABS/rules" "$TARGET_AGENTS_DIR/sk-specs/rules"
    echo "- Đã đồng bộ thư mục sk-specs/rules/"

    dry_rm_rf "$TARGET_AGENTS_DIR/sk-specs/skills"
    dry_cp_r "$SCRIPT_DIR_ABS/skills" "$TARGET_AGENTS_DIR/sk-specs/skills"
    echo "- Đã đồng bộ thư mục sk-specs/skills/"

    dry_rm_rf "$TARGET_AGENTS_DIR/sk-specs/workflows"
    dry_cp_r "$SCRIPT_DIR_ABS/workflows" "$TARGET_AGENTS_DIR/sk-specs/workflows"
    echo "- Đã đồng bộ thư mục sk-specs/workflows/"

    dry_rm_rf "$TARGET_AGENTS_DIR/sk-specs/templates"
    dry_cp_r "$SCRIPT_DIR_ABS/templates" "$TARGET_AGENTS_DIR/sk-specs/templates"
    echo "- Đã đồng bộ thư mục sk-specs/templates/"


    # Đồng bộ các Slash Commands từ commands/ ra .agents/skills/
    # CHỈ xóa và ghi đè các thư mục có prefix 'sk-' để bảo vệ skills riêng của client
    dry_mkdir "$TARGET_AGENTS_DIR/skills"

    # Xóa chỉ các thư mục sk-* đã tồn tại
    for sk_dir in "$TARGET_AGENTS_DIR/skills"/sk-*/; do
        if [ -d "$sk_dir" ]; then
            dry_rm_rf "$sk_dir"
        fi
    done

    # Copy từng thư mục sk-* từ commands/ vào .agents/skills/
    for sk_cmd in "$SCRIPT_DIR_ABS/commands"/sk-*/; do
        if [ -d "$sk_cmd" ]; then
            cmd_name=$(basename "$sk_cmd")
            dry_cp_r "$sk_cmd" "$TARGET_AGENTS_DIR/skills/$cmd_name"
        fi
    done
    echo "- Đã đồng bộ các Slash Commands (sk-*) vào .agents/skills/ (giữ nguyên skills riêng của client)"

fi

# Khởi tạo các thư mục tiến độ rỗng nếu chưa tồn tại tại root của client workspace
dry_mkdir "$CLIENT_DIR_ABS/sk-specs/active"
dry_mkdir "$CLIENT_DIR_ABS/sk-specs/completed"
dry_mkdir "$CLIENT_DIR_ABS/sk-specs/archived"
echo "- Đã đảm bảo các thư mục active/, completed/, archived/ tồn tại tại root của client workspace"


# Khởi tạo thư mục sk-specs/hooks/ nếu chưa tồn tại tại client workspace
CLIENT_HOOKS_DIR="$CLIENT_DIR_ABS/sk-specs/hooks"
if [ ! -d "$CLIENT_HOOKS_DIR" ]; then
    echo "- Thư mục sk-specs/hooks/ chưa tồn tại. Tiến hành khởi tạo..."
    dry_mkdir "$CLIENT_HOOKS_DIR"
fi


# Sao chép các tệp script mẫu từ hooks sang sk-specs/hooks với cơ chế version/hash
MANIFEST_PATH="$CLIENT_HOOKS_DIR/.hooks-manifest.json"

# Hàm tính SHA-256 hash của file
compute_hash() {
    shasum -a 256 "$1" 2>/dev/null | awk '{print $1}'
}

# Hàm đọc giá trị từ manifest JSON (đơn giản, dùng grep/sed)
get_manifest_value() {
    local key="$1"
    local field="$2"
    if [ -f "$MANIFEST_PATH" ]; then
        # Tìm block của key và lấy field value
        grep -A2 "\"$key\"" "$MANIFEST_PATH" | grep "\"$field\"" | sed 's/.*: *"\(.*\)".*/\1/' | head -1
    fi
}

if [ -d "$SCRIPT_DIR_ABS/hooks" ]; then
    # Khởi tạo manifest nếu chưa có
    if [ ! -f "$MANIFEST_PATH" ]; then
        if [ "$DRY_RUN" = true ]; then
            echo "  [DRY-RUN] Sẽ khởi tạo manifest rỗng tại: $MANIFEST_PATH"
        else
            echo "{}" > "$MANIFEST_PATH"
        fi
    fi


    for hook_file in "$SCRIPT_DIR_ABS"/hooks/*; do
        if [ -f "$hook_file" ]; then
            filename=$(basename "$hook_file")
            # Bỏ qua file ẩn
            case "$filename" in .*) continue ;; esac

            target_hook_path="$CLIENT_HOOKS_DIR/$filename"
            new_upstream_hash=$(compute_hash "$hook_file")

            if [ ! -f "$target_hook_path" ]; then
                # Hook chưa tồn tại → copy mới
                dry_cp "$hook_file" "$target_hook_path"
                dry_chmod 755 "$target_hook_path"
                # Cập nhật manifest (append/replace)
                echo "  * Khởi tạo hook mẫu: sk-specs/hooks/$filename"
            else
                # Hook đã tồn tại → kiểm tra version
                old_upstream_hash=$(get_manifest_value "$filename" "upstreamHash")

                if [ "$old_upstream_hash" = "$new_upstream_hash" ]; then
                    # Upstream không thay đổi → bỏ qua
                    continue
                fi

                # Upstream đã thay đổi
                current_client_hash=$(compute_hash "$target_hook_path")

                if [ "$current_client_hash" = "$old_upstream_hash" ]; then
                    # Client CHƯA customize → tự động cập nhật
                    dry_cp "$hook_file" "$target_hook_path"
                    dry_chmod 755 "$target_hook_path"
                    echo "  * Cập nhật hook: sk-specs/hooks/$filename (upstream mới)"
                else
                    # Client ĐÃ customize → tạo file .upstream
                    dry_cp "$hook_file" "$target_hook_path.upstream"
                    dry_chmod 755 "$target_hook_path.upstream"
                    echo "  ⚠️  Hook '$filename' đã được tùy chỉnh tại client. Bản cập nhật mới lưu tại: $filename.upstream"
                    echo "     -> Vui lòng merge thủ công và xóa file .upstream sau khi hoàn tất."
                fi
            fi
        fi
    done


    # Ghi lại manifest hoàn chỉnh bằng Node.js helper (nếu có) hoặc manual JSON
    # Sử dụng node one-liner để tạo manifest chính xác
    if [ "$DRY_RUN" = true ]; then
        echo "  [DRY-RUN] Sẽ cập nhật tệp manifest: $MANIFEST_PATH"
    else
        if command -v node &>/dev/null; then
            node -e "
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const hooksDir = '$CLIENT_HOOKS_DIR';
const manifestPath = path.join(hooksDir, '.hooks-manifest.json');
const srcHooksDir = '$SCRIPT_DIR_ABS/hooks';
const manifest = {};
const files = fs.readdirSync(srcHooksDir).filter(f => !f.startsWith('.'));
for (const f of files) {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(srcHooksDir, f))).digest('hex');
    const clientPath = path.join(hooksDir, f);
    if (fs.existsSync(clientPath)) {
        const clientHash = crypto.createHash('sha256').update(fs.readFileSync(clientPath)).digest('hex');
        manifest[f] = { upstreamHash: clientHash === hash ? hash : (manifest[f]?.upstreamHash || hash) };
    } else {
        manifest[f] = { upstreamHash: hash };
    }
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
" 2>/dev/null
        fi
    fi

fi

echo "Đồng bộ cấu hình quy trình phát triển phần mềm hoàn tất thành công!"

