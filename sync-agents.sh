#!/bin/bash

# Kiểm tra đối số đầu vào
if [ -z "$1" ]; then
    echo "Lỗi: Vui lòng cung cấp đường dẫn đến dự án client."
    echo "Sử dụng: $0 <duong-dan-du-an-client>"
    exit 1
fi

CLIENT_DIR="$1"

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

echo "Bắt đầu đồng bộ cấu hình Multi-Agent..."
echo "Thư mục nguồn (sk-specs): $SCRIPT_DIR_ABS"
echo "Thư mục đích (Client .agents/): $TARGET_AGENTS_DIR"

# Kiểm tra sự tồn tại của thư mục .agents ở client và hiển thị log phù hợp
if [ -d "$TARGET_AGENTS_DIR" ]; then
    echo "- Tìm thấy thư mục .agents/ đã có sẵn tại dự án client."
else
    echo "- Thư mục .agents/ chưa tồn tại. Tiến hành khởi tạo thư mục .agents/ mới..."
    mkdir -p "$TARGET_AGENTS_DIR"
fi

# Kiểm tra xem có đang chạy trực tiếp từ trong thư mục .agents/sk-specs của client hay không
if [ "$SCRIPT_DIR_ABS" = "$TARGET_AGENTS_DIR/sk-specs" ]; then
    echo "- Đang chạy trực tiếp từ thư mục .agents/sk-specs của dự án client. Không cần tự nhân bản."
else
    # Đồng bộ bản sao của toàn bộ repo sk-specs vào trong TARGET_AGENTS_DIR/sk-specs/
    echo "Đang đồng bộ cấu hình sk-specs vào .agents/sk-specs/..."
    mkdir -p "$TARGET_AGENTS_DIR/sk-specs"

    # Copy các file tĩnh
    cp "$SCRIPT_DIR_ABS/README.md" "$TARGET_AGENTS_DIR/sk-specs/" 2>/dev/null
    cp "$SCRIPT_DIR_ABS/PROJECT_STRUCTURE.md" "$TARGET_AGENTS_DIR/sk-specs/" 2>/dev/null
    cp "$SCRIPT_DIR_ABS/sync-agents.sh" "$TARGET_AGENTS_DIR/sk-specs/" 2>/dev/null
    cp "$SCRIPT_DIR_ABS/sync.js" "$TARGET_AGENTS_DIR/sk-specs/" 2>/dev/null
    cp "$SCRIPT_DIR_ABS/package.json" "$TARGET_AGENTS_DIR/sk-specs/" 2>/dev/null
    chmod +x "$TARGET_AGENTS_DIR/sk-specs/sync-agents.sh" 2>/dev/null
    chmod +x "$TARGET_AGENTS_DIR/sk-specs/sync.js" 2>/dev/null

    # Copy các thư mục cấu hình và templates vào sk-specs/
    rm -rf "$TARGET_AGENTS_DIR/sk-specs/rules"
    cp -R "$SCRIPT_DIR_ABS/rules" "$TARGET_AGENTS_DIR/sk-specs/rules"
    echo "- Đã đồng bộ thư mục sk-specs/rules/"

    rm -rf "$TARGET_AGENTS_DIR/sk-specs/skills"
    cp -R "$SCRIPT_DIR_ABS/skills" "$TARGET_AGENTS_DIR/sk-specs/skills"
    echo "- Đã đồng bộ thư mục sk-specs/skills/"

    rm -rf "$TARGET_AGENTS_DIR/sk-specs/workflows"
    cp -R "$SCRIPT_DIR_ABS/workflows" "$TARGET_AGENTS_DIR/sk-specs/workflows"
    echo "- Đã đồng bộ thư mục sk-specs/workflows/"

    rm -rf "$TARGET_AGENTS_DIR/sk-specs/templates"
    cp -R "$SCRIPT_DIR_ABS/templates" "$TARGET_AGENTS_DIR/sk-specs/templates"
    echo "- Đã đồng bộ thư mục sk-specs/templates/"
fi

# Khởi tạo các thư mục tiến độ rỗng nếu chưa tồn tại
mkdir -p "$TARGET_AGENTS_DIR/sk-specs/active"
mkdir -p "$TARGET_AGENTS_DIR/sk-specs/completed"
mkdir -p "$TARGET_AGENTS_DIR/sk-specs/archived"
echo "- Đã đảm bảo các thư mục active/, completed/, archived/ tồn tại"

echo "Đồng bộ cấu hình Multi-Agent hoàn tất thành công!"
