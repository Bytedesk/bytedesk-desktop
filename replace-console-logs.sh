#!/bin/bash

# Console.log 批量替换脚本
# 用于将项目中的 console.log 替换为 logger 调用

echo "开始批量替换 console.log..."

# 定义需要处理的目录
SRC_DIR="/Users/ningjinpeng/Desktop/git/private/github/bytedesk-frontend-private/apps/desktop/src"

# 需要添加 logger 导入的文件列表
files_to_process=(
    "hooks/useMqtt.ts"
    "hooks/useMulticast.ts"
    "db/IndexedDbService.ts"
    "db/useIndexedDB.ts"
    "services/ticketService.ts"
    "pages/Auth/Login/index.tsx"
    "pages/Auth/Login/Mobile.tsx"
    "pages/Auth/Login/Account.tsx"
    "pages/Auth/Login/Scan.tsx"
    "pages/Dashboard/FootBar/index.tsx"
    "pages/Dashboard/FootBar/BottomLeftMenu.tsx"
    "pages/Dashboard/Setting/Profile/UserProfile.tsx"
)

# 函数：检查文件是否已经导入了 logger
check_logger_import() {
    local file="$1"
    if grep -q "import logger from" "$file" 2>/dev/null; then
        return 0  # 已导入
    else
        return 1  # 未导入
    fi
}

# 函数：添加 logger 导入
add_logger_import() {
    local file="$1"
    
    # 检查是否已经有 logger 导入
    if check_logger_import "$file"; then
        echo "✓ $file 已经导入了 logger"
        return
    fi
    
    # 在最后一个 import 语句后添加 logger 导入
    if [[ "$file" == *.tsx ]]; then
        # 对于 TSX 文件，在 React 相关导入后添加
        sed -i '' '/^import.*from.*react/a\
import logger from "@/utils/logger";
' "$file"
    else
        # 对于 TS 文件，在最后一个导入后添加
        sed -i '' '/^import.*from/a\
import logger from "@/utils/logger";
' "$file"
    fi
    
    echo "✓ 已为 $file 添加 logger 导入"
}

# 函数：替换 console.log
replace_console_logs() {
    local file="$1"
    
    # 统计替换前的 console.log 数量
    local before_count=$(grep -c "console\.log" "$file" 2>/dev/null || echo "0")
    
    if [[ $before_count -eq 0 ]]; then
        echo "✓ $file 中没有 console.log 需要替换"
        return
    fi
    
    # 执行替换
    sed -i '' 's/console\.log(/logger.debug(/g' "$file"
    sed -i '' 's/console\.info(/logger.info(/g' "$file"
    sed -i '' 's/console\.warn(/logger.warn(/g' "$file"
    sed -i '' 's/console\.debug(/logger.debug(/g' "$file"
    # 注意：不替换 console.error，因为错误日志应该总是显示
    
    # 统计替换后的数量
    local after_count=$(grep -c "console\.log\|console\.info\|console\.warn\|console\.debug" "$file" 2>/dev/null || echo "0")
    
    echo "✓ $file: 替换了 $before_count 个 console.log 调用"
}

# 处理指定的文件
echo "处理指定的文件..."
for file_path in "${files_to_process[@]}"; do
    full_path="$SRC_DIR/$file_path"
    
    if [[ -f "$full_path" ]]; then
        echo "处理文件: $file_path"
        add_logger_import "$full_path"
        replace_console_logs "$full_path"
    else
        echo "⚠️  文件不存在: $file_path"
    fi
done

# 处理所有其他包含 console.log 的文件
echo -e "\n处理其他包含 console.log 的文件..."

# 查找所有包含 console.log 的文件
find "$SRC_DIR" -name "*.ts" -o -name "*.tsx" | xargs grep -l "console\.log" 2>/dev/null | while read file; do
    # 检查是否已经在处理列表中
    relative_path=${file#$SRC_DIR/}
    
    # 检查是否在已处理列表中
    skip=false
    for processed in "${files_to_process[@]}"; do
        if [[ "$relative_path" == "$processed" ]]; then
            skip=true
            break
        fi
    done
    
    if [[ "$skip" == "false" ]]; then
        echo "处理额外文件: $relative_path"
        add_logger_import "$file"
        replace_console_logs "$file"
    fi
done

echo -e "\n✅ 批量替换完成!"
echo "请注意："
echo "1. console.error 没有被替换，因为错误日志应该总是显示"
echo "2. 请检查替换结果并测试功能是否正常"
echo "3. 某些文件可能需要手动调整 logger 导入的位置"
