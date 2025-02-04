/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-03-09 12:24:08
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-17 06:59:02
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { ipcMain } from "electron";
import {
  HTTP_MESSAGE,
  MULTICAST_MESSAGE,
  NOTIFICATION_MESSAGE,
  WEBSOCKET_MESSAGE,
} from "../utils/constants";
import multicast from "../network/multicast";

// 监听来自render的消息
const registerMessageHandler = () => {
  console.log("registerMessageHandler");
  // 接收来自render的调用
  ipcMain.on(MULTICAST_MESSAGE, (event, message) => {
    console.log("electron messageHandler broadcast multicast message", message);
    // 广播给所有客户端
    multicast.sendMutlicastMessage(message);
  });
  ipcMain.on(WEBSOCKET_MESSAGE, (event, message) => {
    console.log("electron messageHandler broadcast websocket message", message);
  });
  ipcMain.on(HTTP_MESSAGE, (event, message) => {
    console.log("electron messageHandler broadcast http message", message);
  });
  ipcMain.on(NOTIFICATION_MESSAGE, (event, message) => { 
    console.log("electron messageHandler broadcast notification message", message);
  })
};

export default registerMessageHandler;
