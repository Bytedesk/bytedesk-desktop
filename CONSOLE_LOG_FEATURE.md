# Desktop 项目 Console.log 开关功能

## ✅ 功能已完成

我已经成功为 desktop 项目添加了 console.log 开关功能。

## 🎯 主要特性

1. **用户友好的开关控制**
   - 在 `设置 > 基本设置` 页面新增"控制台日志"开关
   - 支持亮色/暗色主题
   - 实时生效，无需重启

2. **智能默认设置**
   - 开发环境：默认开启
   - 生产环境：默认关闭
   - 设置自动保存到 localStorage

3. **分级日志控制**
   - 普通日志（log/info/warn/debug）：受开关控制
   - 错误日志（error）：总是显示，确保问题可追踪

## 🚀 快速使用

### 1. 导入 Logger
```typescript
import logger from '@/utils/logger';
```

### 2. 替换现有 console.log
```typescript
// 旧写法
console.log('用户登录成功');

// 新写法  
logger.log('用户登录成功');
```

### 3. 使用不同级别日志
```typescript
logger.info('信息日志');    // 受开关控制
logger.warn('警告日志');    // 受开关控制  
logger.debug('调试日志');   // 受开关控制
logger.error('错误日志');   // 总是显示
```

## 🔧 测试方法

1. 启动 desktop 应用
2. 进入 `设置 > 基本设置`
3. 找到"控制台日志"开关并切换
4. 打开浏览器开发者工具控制台
5. 切换开关观察日志输出变化

## 📁 修改的文件

- `src/utils/constants.ts` - 添加 LOG_ENABLE 常量
- `src/utils/logger.ts` - 升级日志工具支持开关控制
- `src/pages/Dashboard/Setting/Basic/index.tsx` - 添加开关UI

## 💡 使用建议

1. **逐步迁移**：将现有的 `console.log` 逐步替换为 `logger.log`
2. **错误处理**：重要错误使用 `logger.error`，确保总是可见
3. **生产环境**：建议关闭日志避免敏感信息泄露
4. **开发调试**：开启日志便于问题排查

## 🎉 完成状态

✅ Constants 定义完成
✅ Logger 工具升级完成  
✅ UI 开关组件完成
✅ 状态管理完成
✅ 本地存储完成
✅ 暗色主题适配完成
✅ 使用示例完成

现在您可以在 desktop 项目中享受灵活的日志控制功能！
