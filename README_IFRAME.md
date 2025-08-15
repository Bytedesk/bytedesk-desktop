# 微语Desktop iframe通信接口文档

## 概述

微语Desktop支持通过iframe嵌入到外部系统中，并提供双向通信机制。当检测到页面在iframe中运行时，会自动启用通信功能。

## 向外发送的事件

### 1. 未读消息总数事件 (unread_message_count)

当未读消息数量发生变化时触发。

```javascript
// 父窗口接收消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'unread_message_count') {
    const { totalUnreadCount, unreadThreads } = event.data.data;
    console.log('未读消息总数:', totalUnreadCount);
    console.log('未读会话列表:', unreadThreads);
  }
});
```

### 2. 新访客消息事件 (new_visitor_message)

当有新访客接入时触发。

```javascript
// 父窗口接收消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'new_visitor_message') {
    const { thread } = event.data.data;
    console.log('新访客接入:', thread);
    // thread包含: uid, topic, type, user, content, createdAt
  }
});
```

### 3. 座席状态变化事件 (agent_status_changed)

当座席状态发生变化时触发。

```javascript
// 父窗口接收消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'agent_status_changed') {
    const { status, agentInfo } = event.data.data;
    console.log('座席状态变化:', status);
    console.log('座席信息:', agentInfo);
  }
});
```

### 4. 会话状态变化事件 (thread_status_changed)

当会话状态发生变化时触发。

```javascript
// 父窗口接收消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'thread_status_changed') {
    const { thread, action } = event.data.data;
    console.log('会话状态变化:', action);
    console.log('会话详情:', thread);
  }
});
```

## 接收外部事件

### 1. 更新座席状态 (update_agent_status)

```javascript
// 父窗口发送消息
const iframe = document.getElementById('bytedesk-iframe');
iframe.contentWindow.postMessage({
  type: 'update_agent_status',
  data: { status: 'AVAILABLE' } // 可选值: AVAILABLE, BUSY, OFFLINE
}, '*');
```

### 2. 设置座席为在线状态 (update_agent_status_available)

```javascript
// 父窗口发送消息
iframe.contentWindow.postMessage({
  type: 'update_agent_status_available'
}, '*');
```

### 3. 设置座席为忙碌状态 (update_agent_status_busy)

```javascript
// 父窗口发送消息
iframe.contentWindow.postMessage({
  type: 'update_agent_status_busy'
}, '*');
```

### 4. 设置座席为离线状态 (update_agent_status_offline)

```javascript
// 父窗口发送消息
iframe.contentWindow.postMessage({
  type: 'update_agent_status_offline'
}, '*');
```

### 5. 刷新会话列表 (refresh_threads)

```javascript
// 父窗口发送消息
iframe.contentWindow.postMessage({
  type: 'refresh_threads'
}, '*');
```

### 6. 清除指定会话的未读消息数 (clear_unread_count)

```javascript
// 父窗口发送消息
iframe.contentWindow.postMessage({
  type: 'clear_unread_count',
  data: { threadUid: 'thread_uid_here' }
}, '*');
```

## 使用示例

### 完整的父窗口代码示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>微语客服系统</title>
</head>
<body>
    <iframe 
        id="bytedesk-iframe" 
        src="https://your-domain.com/desktop" 
        width="100%" 
        height="600px"
        frameborder="0">
    </iframe>

    <script>
        const iframe = document.getElementById('bytedesk-iframe');
        
        // 监听来自微语的消息
        window.addEventListener('message', (event) => {
            // 验证消息来源
            if (event.origin !== 'https://your-domain.com') {
                return;
            }
            
            const { type, data, timestamp, source } = event.data;
            
            if (source !== 'bytedesk-desktop') {
                return;
            }
            
            switch (type) {
                case 'unread_message_count':
                    console.log('未读消息总数:', data.totalUnreadCount);
                    // 更新UI显示未读消息数量
                    updateUnreadCount(data.totalUnreadCount);
                    break;
                    
                case 'new_visitor_message':
                    console.log('新访客接入:', data.thread);
                    // 显示新访客通知
                    showNewVisitorNotification(data.thread);
                    break;
                    
                case 'agent_status_changed':
                    console.log('座席状态变化:', data.status);
                    // 更新座席状态显示
                    updateAgentStatus(data.status);
                    break;
                    
                case 'thread_status_changed':
                    console.log('会话状态变化:', data.action);
                    // 更新会话状态显示
                    updateThreadStatus(data.thread, data.action);
                    break;
            }
        });
        
        // 示例：设置座席为在线状态
        function setAgentOnline() {
            iframe.contentWindow.postMessage({
                type: 'update_agent_status_available'
            }, '*');
        }
        
        // 示例：设置座席为忙碌状态
        function setAgentBusy() {
            iframe.contentWindow.postMessage({
                type: 'update_agent_status_busy'
            }, '*');
        }
        
        // 示例：设置座席为离线状态
        function setAgentOffline() {
            iframe.contentWindow.postMessage({
                type: 'update_agent_status_offline'
            }, '*');
        }
        
        // 示例：刷新会话列表
        function refreshThreads() {
            iframe.contentWindow.postMessage({
                type: 'refresh_threads'
            }, '*');
        }
        
        // 示例：清除指定会话的未读消息数
        function clearThreadUnread(threadUid) {
            iframe.contentWindow.postMessage({
                type: 'clear_unread_count',
                data: { threadUid }
            }, '*');
        }
        
        // UI更新函数示例
        function updateUnreadCount(count) {
            // 更新未读消息数量显示
            document.getElementById('unread-count').textContent = count;
        }
        
        function showNewVisitorNotification(thread) {
            // 显示新访客通知
            alert(`新访客接入: ${thread.user.nickname}`);
        }
        
        function updateAgentStatus(status) {
            // 更新座席状态显示
            document.getElementById('agent-status').textContent = status;
        }
        
        function updateThreadStatus(thread, action) {
            // 更新会话状态显示
            console.log(`会话 ${thread.uid} 状态变化: ${action}`);
        }
    </script>
</body>
</html>
```

## 注意事项

1. **安全性**: 请确保验证消息来源，只处理来自可信域名的消息。
2. **兼容性**: 确保父窗口和iframe使用相同的协议（http/https）。
3. **错误处理**: 建议添加适当的错误处理机制。
4. **性能**: 避免频繁发送消息，以免影响性能。
5. **调试**: 在开发环境中，可以通过浏览器控制台查看通信日志。

## 座席状态说明

- `AVAILABLE`: 在线接待
- `BUSY`: 客服忙碌  
- `OFFLINE`: 客服下线

## 会话类型说明

- `AGENT`: 一对一客服会话
- `WORKGROUP`: 工作组客服会话
- `ROBOT`: 机器人客服会话
- `MEMBER`: 同事一对一会话
- `GROUP`: 群组会话 