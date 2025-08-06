#!/usr/bin/env python3
import os
import re

def check_all_duplicate_logger_imports():
    """检查项目中所有文件的重复 logger 导入"""
    
    duplicate_files = []
    
    # 遍历所有 TypeScript 文件
    for root, dirs, files in os.walk('.'):
        # 跳过 node_modules 等目录
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', 'build']]
        
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # 查找所有 logger 导入
                    import_pattern = r'import\s+logger\s+from\s+["\']@/utils/logger["\'];?'
                    matches = list(re.finditer(import_pattern, content))
                    
                    if len(matches) > 1:
                        print(f"\n=== {file_path} ===")
                        print(f"发现 {len(matches)} 个重复的 logger 导入:")
                        
                        lines = content.split('\n')
                        for i, match in enumerate(matches):
                            # 找到匹配的行号
                            line_start = content[:match.start()].count('\n') + 1
                            print(f"  导入 {i+1} - 行 {line_start}: {lines[line_start-1].strip()}")
                        
                        duplicate_files.append({
                            'file': file_path,
                            'count': len(matches),
                            'lines': [content[:match.start()].count('\n') + 1 for match in matches]
                        })
                        
                except Exception as e:
                    print(f"处理文件 {file_path} 时出错: {e}")
    
    if duplicate_files:
        print(f"\n=== 总结 ===")
        print(f"总共发现 {len(duplicate_files)} 个文件存在重复 logger 导入:")
        for item in duplicate_files:
            print(f"  {item['file']} ({item['count']} 次重复)")
    else:
        print("\n✅ 没有发现重复的 logger 导入")
    
    return duplicate_files

if __name__ == "__main__":
    check_all_duplicate_logger_imports()
