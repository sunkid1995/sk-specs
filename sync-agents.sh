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

echo "Bắt đầu đồng bộ cấu hình Multi-Agent..."
echo "Thư mục nguồn (sk-specs): $SCRIPT_DIR_ABS"
echo "Thư mục đích (Client): $CLIENT_DIR_ABS"

# Tạo thư mục .agents nếu chưa tồn tại
mkdir -p "$CLIENT_DIR_ABS/.agents"

# Đồng bộ các thư mục rules, skills, workflows (Ghi đè để cập nhật bản mới nhất)
echo "Đang đồng bộ rules, skills, workflows..."

# rules
rm -rf "$CLIENT_DIR_ABS/.agents/rules"
cp -R "$SCRIPT_DIR_ABS/rules" "$CLIENT_DIR_ABS/.agents/rules"
echo "- Đã đồng bộ thư mục rules/"

# skills
rm -rf "$CLIENT_DIR_ABS/.agents/skills"
cp -R "$SCRIPT_DIR_ABS/skills" "$CLIENT_DIR_ABS/.agents/skills"
echo "- Đã đồng bộ thư mục skills/"

# workflows
rm -rf "$CLIENT_DIR_ABS/.agents/workflows"
cp -R "$SCRIPT_DIR_ABS/workflows" "$CLIENT_DIR_ABS/.agents/workflows"
echo "- Đã đồng bộ thư mục workflows/"

# Khởi tạo cấu trúc sk-specs
echo "Đang khởi tạo cấu trúc .agents/sk-specs/..."

mkdir -p "$CLIENT_DIR_ABS/.agents/sk-specs/active"
mkdir -p "$CLIENT_DIR_ABS/.agents/sk-specs/completed"
mkdir -p "$CLIENT_DIR_ABS/.agents/sk-specs/archived"
echo "- Đã đảm bảo các thư mục active/, completed/, archived/ tồn tại"

# Đồng bộ templates vào .agents/sk-specs/templates
rm -rf "$CLIENT_DIR_ABS/.agents/sk-specs/templates"
cp -R "$SCRIPT_DIR_ABS/templates" "$CLIENT_DIR_ABS/.agents/sk-specs/templates"
echo "- Đã đồng bộ các file template vào sk-specs/templates/"

echo "Đồng bộ cấu hình Multi-Agent hoàn tất thành công!"
