/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 21:18:00
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-20 22:34:19
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
  BrowserWindow,
  Menu,
  MenuItem,
  app,
  dialog,
  globalShortcut,
} from "electron";
import { createMainWindow } from "./windowManager";
import { getIsAppQuitting } from "./storeManager";
import { stopPythonServer } from "./pythonManager";
// import { version } from "../../package.json";

export const registerAppEvents = (mainWindow: BrowserWindow) => {
  console.log("registerAppEvents");

  app.on("browser-window-created", (event, win) => {
    console.log("browser-window-created");
    win.webContents.on("context-menu", (e, params) => {
      // console.log("context-menu", e, params);
      // 右键上下文菜单
      const menu = new Menu();
      menu.append(new MenuItem({ label: "微语" }));
      menu.popup({ window: win, x: params.x, y: params.y });
    });
  });

  // 
  app.on("window-all-closed", () => {
    console.log("window-all-closed");
    if (getIsAppQuitting()) {
      globalShortcut.unregisterAll();
      mainWindow = null;
      stopPythonServer();
      return;
    } 
    // if (process.platform !== 'darwin') {
    //   // isAppQuit = true
    //   app.quit();
    //   app.exit(0)
    // }
  });
 
  // app.on("second-instance", (event, commandLine, workingDirectory) => {
  //   console.log("second-instance");
  //   // Someone tried to run a second instance, we should focus our window.
  //   if (mainWindow) {
  //     // Focus on the main window if the user tried to open another
  //     if (mainWindow.isMinimized()) mainWindow.restore();
  //     mainWindow.focus();
  //   } 
  //   // the commandLine is array of strings in which last element is deep link url
  //   // dialog.showErrorBox(
  //   //   "Welcome Back",
  //   //   `You arrived from: ${commandLine.pop()}`
  //   // ); 
  // });

  app.on("activate", function () {
    console.log("app activate");
    // if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      console.log("activate allWindows");
      allWindows[0].show();
    } else {
      console.log("activate createMainWindow");
      mainWindow = createMainWindow();
    }
  });

  // Handle the protocol. In this case, we choose to show an Error Box.
  app.on("open-url", (event, url) => {
    console.log("app open-url", url);
    if (url) {
      // dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
    }
    console.log("app open url by deeplink:", url);
  });

  app.on("will-quit", () => {
    console.log("app will-quit");
    globalShortcut.unregisterAll();
    mainWindow = null;
    stopPythonServer();
  });
  // 任务栏-自定义菜单
  // https://www.electronjs.org/docs/latest/tutorial/windows-taskbar
  // app.setUserTasks([
  //   { 
  //     program: process.execPath,
  //     arguments: "--new-window",
  //     iconPath: process.execPath,
  //     iconIndex: 0,
  //     title: "New Window",
  //     description: "Create a new window",
  //   },
  // ]);
  app.getLoginItemSettings()
  app.setAboutPanelOptions({
    applicationName: "微语",
    applicationVersion: `v${app.getVersion()}`,
    copyright: "Copyright © 2024 weiyuai.cn",
    // credits: "weiyuai.cn",
    // version: `${version}`, // electron version
  });
};
