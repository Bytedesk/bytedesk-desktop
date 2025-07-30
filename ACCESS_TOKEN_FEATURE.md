# AccessToken 登录功能

## 概述

本功能允许用户通过 URL 参数中的 `accessToken` 在任意路径进行自动登录，无需手动输入用户名和密码。

## 功能特性

1. **全局支持**: 在任意路径都支持通过 `accessToken` 参数进行登录
2. **自动处理**: 无需手动调用，系统会自动检测并处理 `accessToken`
3. **国际化支持**: 支持多语言错误提示和成功消息
4. **安全清理**: 登录成功后自动清除 URL 中的 `accessToken` 参数
5. **错误处理**: 完善的错误处理和用户提示

## 使用方法

### 1. URL 格式

```
https://your-domain.com/any-path?accessToken=your-access-token
```

### 2. 支持的路径

- `/chat` - 聊天页面
- `/contact` - 联系人页面
- `/robot` - 机器人页面
- `/ticket` - 工单页面
- `/setting` - 设置页面
- `/auth/login` - 登录页面
- 以及任意其他路径

### 3. 示例

```
https://your-domain.com/chat?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
https://your-domain.com/setting?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
https://your-domain.com/auth/login?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 技术实现

### 1. 公共工具函数

创建了 `apps/desktop/src/utils/authUtils.ts` 文件，包含两个主要函数：

- `checkUrlAccessToken()` - 基础版本
- `checkUrlAccessTokenWithI18n()` - 支持国际化的版本

### 2. 路由级别处理

在 `apps/desktop/src/routes/index.tsx` 中添加了 `AccessTokenHandler` 组件，用于在路由级别统一处理 `accessToken` 验证。

### 3. 组件集成

所有路由都被 `AccessTokenHandler` 包装，确保在任意路径都能处理 `accessToken`。

## 工作流程

### 验证成功流程
1. **检测**: 系统检测 URL 中是否存在 `accessToken` 参数
2. **验证**: 如果存在且用户未登录，调用 API 验证 `accessToken`
3. **登录**: 验证成功后自动设置用户信息和新的 `accessToken`
4. **跳转**: 根据当前路径进行适当的页面跳转
5. **清理**: 清除 URL 中的 `accessToken` 参数
6. **通知**: 显示登录成功消息

### 验证失败流程
1. **检测**: 系统检测 URL 中是否存在 `accessToken` 参数
2. **验证**: 调用 API 验证 `accessToken`
3. **失败**: 验证失败，显示错误消息
4. **清理**: 清除 URL 中的 `accessToken` 参数
5. **显示**: 显示登录页面，用户可以手动登录

### 防重复验证机制

- 使用 `tokenValidationState` 状态管理验证流程：`idle` → `validating` → `completed`
- 验证失败后不会重复尝试，直接显示登录页面
- 清除旧消息避免重复显示
- 验证失败时自动清除 URL 中的 accessToken 参数
- 路由级别和组件级别的处理逻辑协调工作

## 错误处理

- **无效 Token**: 显示错误消息，不进行页面跳转
- **网络错误**: 显示网络错误提示
- **服务器错误**: 显示服务器返回的错误信息

## 安全考虑

1. **参数清理**: 登录成功后自动清除 URL 中的 `accessToken` 参数
2. **状态检查**: 只有在用户未登录时才处理 `accessToken`
3. **错误处理**: 完善的错误处理机制，避免敏感信息泄露

## 兼容性

- 支持 Electron 和 Web 环境
- 支持多语言界面
- 与现有的登录流程完全兼容
- 不影响现有的手动登录功能

## 注意事项

1. `accessToken` 应该是一次性的，使用后失效
2. 建议在生产环境中使用 HTTPS 协议
3. Token 应该有过期时间限制
4. 建议在服务器端记录 Token 使用情况

## 开发调试

在开发环境中，可以通过以下方式测试：

```javascript
// 在浏览器控制台中测试
window.location.href = 'http://localhost:3000/chat?accessToken=test-token';
```

## 相关文件

- `apps/desktop/src/utils/authUtils.ts` - 核心工具函数
- `apps/desktop/src/routes/index.tsx` - 路由处理逻辑
- `apps/desktop/src/pages/Auth/Login/index.tsx` - 登录页面（已更新）
- `apps/desktop/src/pages/Dashboard/index.tsx` - 仪表板页面（已更新） 