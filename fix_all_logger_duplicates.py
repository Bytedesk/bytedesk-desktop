#!/usr/bin/env python3
import os
import re

def fix_duplicate_logger_imports():
    """修复项目中所有文件的重复 logger 导入"""
    
    fixed_files = []
    
    # 遍历所有 TypeScript 文件
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        original_content = content
                        
                    # 查找所有 logger 导入
                    import_pattern = r'import\s+logger\s+from\s+["\']@/utils/logger["\'];?'
                    matches = list(re.finditer(import_pattern, content))
                    
                    if len(matches) > 1:
                        print(f"修复文件: {file_path} (发现 {len(matches)} 个重复导入)")
                        
                        # 保留第一个导入，删除其他的
                        lines = content.split('\n')
                        lines_to_remove = []
                        
                        for i, match in enumerate(matches):
                            if i > 0:  # 跳过第一个导入
                                line_num = content[:match.start()].count('\n')
                                lines_to_remove.append(line_num)
                        
                        # 从后往前删除行（避免索引变化）
                        for line_num in sorted(lines_to_remove, reverse=True):
                            if line_num < len(lines):
                                lines.pop(line_num)
                        
                        new_content = '\n'.join(lines)
                        
                        # 写回文件
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        
                        fixed_files.append(file_path)
                        
                except Exception as e:
                    print(f"处理文件 {file_path} 时出错: {e}")
    
    if fixed_files:
        print(f"\n✅ 总共修复了 {len(fixed_files)} 个文件:")
        for file in fixed_files:
            print(f"  - {file}")
    else:
        print("\n✅ 没有发现需要修复的重复 logger 导入")

if __name__ == "__main__":
    fix_duplicate_logger_imports()
