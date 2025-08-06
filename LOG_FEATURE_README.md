# Console.log 开关功能说明

## 功能概述

为 desktop 项目添加了动态控制 console.log 输出的功能。用户可以在设置页面中开启或关闭控制台日志输出，方便调试和生产环境的日志管理。

## 功能特性

### 1. 用户界面控制
- 在 `设置 > 基本设置` 页面新增"控制台日志"开关
- 支持明暗主题适配
- 实时生效，无需重启应用

### 2. 智能默认设置
- 开发环境（IS_DEBUG=true）：默认开启日志
- 生产环境（IS_DEBUG=false）：默认关闭日志
- 用户设置会保存在 localStorage 中

### 3. 日志分类控制
- **普通日志**：受开关控制（log, info, warn, debug）
- **错误日志**：总是显示，不受开关影响（error）
- **条件日志**：支持开发环境特定的调试日志

## 使用方法

### 1. 导入 Logger

```typescript
import logger from '@/utils/logger';
```

### 2. 基本用法

```typescript
// 受开关控制的日志
logger.log('普通日志信息');
logger.info('信息日志');
logger.warn('警告日志');
logger.debug('调试日志');

// 错误日志（总是显示）
logger.error('错误信息');

// 开发环境专用日志
logger.debugIf('只在开发环境显示的调试信息');
```

### 3. 高级功能

```typescript
// 分组日志
logger.group('API调用流程');
logger.info('步骤1：发送请求');
logger.info('步骤2：处理响应');
logger.groupEnd();

// 表格日志
const data = [{ name: 'Alice', age: 25 }];
logger.table(data);

// 时间统计
logger.time('操作耗时');
// ... 执行操作
logger.timeEnd('操作耗时');
```

## 技术实现

### 1. 常量定义
在 `src/utils/constants.ts` 中添加：
```typescript
export const LOG_ENABLE = "LOG_ENABLE";
```

### 2. Logger 更新
修改 `src/utils/logger.ts`：
- 添加 `isLogEnabled()` 函数检查开关状态
- 更新所有日志方法增加开关检查
- 错误日志保持总是显示的特性

### 3. UI 控制
在 `src/pages/Dashboard/Setting/Basic/index.tsx` 中：
- 添加日志开关状态管理
- 实现开关控制UI组件
- 处理开关状态变化和持久化

## 配置项

### localStorage 键值
- **键名**：`LOG_ENABLE`
- **值**：`"true"` 或 `"false"`
- **默认值**：根据 `IS_DEBUG` 决定

### 开关位置
```
设置页面 > 基本设置 > 控制台日志
```

## 兼容性说明

1. **向后兼容**：现有使用 `console.log` 的代码需要逐步迁移到新的 logger
2. **错误处理**：错误日志（logger.error）保持总是显示，确保重要错误信息不被遗漏
3. **开发体验**：开发环境默认开启日志，生产环境默认关闭

## 迁移指南

### 替换现有日志调用

```typescript
// 旧写法
console.log('用户登录成功');
console.info('数据加载完成');
console.warn('网络连接不稳定');
console.error('登录失败');

// 新写法
logger.log('用户登录成功');
logger.info('数据加载完成');
logger.warn('网络连接不稳定');
logger.error('登录失败');
```

### 批量替换建议

可以使用以下正则表达式进行批量替换：
```
查找：console\.(log|info|warn|debug)\(
替换：logger.$1(
```

**注意**：`console.error` 应该替换为 `logger.error`，但要确认这些错误是否需要总是显示。

## 示例代码

完整的使用示例请参考 `src/utils/loggerExample.ts` 文件。

## 测试方法

1. 启动应用进入设置页面
2. 在"基本设置"中找到"控制台日志"开关
3. 切换开关状态
4. 在控制台中观察日志输出的变化
5. 错误日志应该始终显示，不受开关影响

## 注意事项

1. **性能考虑**：关闭日志后，日志处理开销最小化
2. **生产环境**：建议生产环境关闭日志以避免敏感信息泄露
3. **调试便利**：开发和测试时可随时开启日志进行调试
4. **错误追踪**：错误日志始终保持启用状态，确保问题可追踪
