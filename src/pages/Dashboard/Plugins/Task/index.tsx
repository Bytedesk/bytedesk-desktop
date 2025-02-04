/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-25 09:13:24
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-04-25 14:19:09
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
 */

// import { useReducer } from 'react';
import AddTask from "./AddTask";
import TaskList from "./TaskList";
import { TasksProvider } from "./TasksContext";

// 官方教程
// https://zh-hans.react.dev/learn/scaling-up-with-reducer-and-context
export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>任务列表</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
