/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-13 02:39:49
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2025-01-06 13:05:40
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import {
  app,
  BrowserWindow,
} from "electron";
import { release } from "node:os";
// import path from "node:path";
// import { dirname, join } from "node:path";
// import { fileURLToPath } from "node:url";
import { registerAutoUpdateHandler } from "./autoUpdateHandler";
import { registerShortcutHandler } from "./shortcutManager";
import { registerIpcHandler } from "./ipcHandler";
import { registerMenuManager } from "./menuManager";
import { createMainWindow } from "./windowManager";
import { registerTrayHandler } from "./trayManager";
import { registerAppEvents } from "./appManager";
import { setIsAppQuitting } from "./storeManager";
import registerMessageHandler from "./messageHandler";
// import { DEEP_LINK_WEIYUIM } from "../utils/constants";
// import { registerBluetoothManager } from "../network/bluetooth";
// import httpServer from "../network/http";
// import multicast from "../network/multicast";
import clipboard from "../clipboard";
// import socketIo from "../network/socketio";
// import { startPythonServer } from "./pythonManager";
import { getSystemLocale } from './utils';  // 你需要创建这个工具函数

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

// if (!app.requestSingleInstanceLock()) {
//   app.quit();
//   process.exit(0);
// }

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
 
// let isDevEnv = process.env.NODE_ENV === "development";
// let isAppQuit = false;
let mainWindow: BrowserWindow | null = null;

console.log("app is starting");
// deepLink: weiyu-im://open
// https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
// if (process.defaultApp) {
//   console.log("app is default");
//   if (process.argv.length >= 2) {
//     app.setAsDefaultProtocolClient(DEEP_LINK_WEIYUIM, process.execPath, [
//       path.resolve(process.argv[1]),
//     ]);
//   }
// } else {
//   console.log("app is not default");
//   app.setAsDefaultProtocolClient(DEEP_LINK_WEIYUIM);
// }

console.log("app before ready");
// const gotTheLock = app.requestSingleInstanceLock();
// if (!gotTheLock) { 
//   console.log("another instance is running");
//   app.quit();
// } else {
  console.log("got the lock");
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    console.log("app is ready");
    const locale = getSystemLocale();  // 获取系统语言
    
    // 根据系统语言设置应用名称
    if (locale.startsWith('zh')) {
      app.name = '微语';
      app.setName('微语');
    } else {
      app.name = 'ByteDesk';
      app.setName('ByteDesk');
    }
    
    // 
    mainWindow = createMainWindow();
    registerTrayHandler(mainWindow);
    registerShortcutHandler(mainWindow);
    registerMenuManager(mainWindow);
    registerAppEvents(mainWindow);
    // 
    registerAutoUpdateHandler(mainWindow);
    setIsAppQuitting(false);
    //
    registerIpcHandler(mainWindow);
    registerMessageHandler();
    // 
    // registerBluetoothManager(mainWindow);
    // multicast.startMulticastSocket(mainWindow);
    // httpServer.im.startImServer(mainWindow);
    // httpServer.sdrop.startDropServer(mainWindow);
    // httpServer.pdrop.startDropServer(mainWindow);
    clipboard.startClipboardWatcher();
    // 
    // socketIo.startSocketIoServer(mainWindow);
    // startPythonServer(mainWindow);
  });
// }
