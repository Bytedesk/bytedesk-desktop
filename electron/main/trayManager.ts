/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-01-20 21:15:10
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-12-01 08:27:54
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { app, BrowserWindow, Menu, MenuItem, Tray } from "electron";
import { join } from "node:path";
import { createMainWindow } from "./windowManager";
import { setIsAppQuitting } from "./storeManager";
import { createScreenshot } from "./screenshotManager";

let appTray: Tray;

export const registerTrayHandler = (mainWindow: BrowserWindow) => {
  console.log("createTray");
  //
  const trayIconPath = join(process.env.VITE_PUBLIC, "/icons/icon.png");
  //   console.log("trayIconPath:", trayIconPath);
  appTray = new Tray(trayIconPath);
  appTray.setToolTip("微语");
  // appTray.setContextMenu(contextMenu);
  const contextMenu = new Menu();
  // TODO: 设置icon
  contextMenu.append(
    new MenuItem({
      label: "显示",
      // icon:
      click: () => {
        mainWindow.show();
      },
    }),
  );

  // 添加分隔符
  contextMenu.append(new MenuItem({ type: "separator" }));
  
  contextMenu.append(
    new MenuItem({
      label: "截图",
      // icon:
      accelerator: "CmdOrCtrl+Shift+A",
      click: () => {
        const screenshots = createScreenshot(mainWindow);
        screenshots.startCapture();
      },
    }),
  );
  contextMenu.append(
    new MenuItem({
      label: "隐藏当前窗口截图",
      // icon:
      accelerator: "CmdOrCtrl+Shift+B",
      click: () => {
        // 隐藏当前窗口截图
        mainWindow.hide();
        const screenshots = createScreenshot(mainWindow);
        screenshots.startCapture();
      },
    }),
  );

  // 添加分隔符
  contextMenu.append(new MenuItem({ type: "separator" }));

  contextMenu.append(
    new MenuItem({
      label: "退出",
      // icon:
      click: () => {
        // isAppQuit = true;
        setIsAppQuitting(true);
        app.quit();
      },
    }),
  );
  appTray.setContextMenu(contextMenu);
  // 点击托盘图标时触发的事件
  appTray.on("click", () => {
    console.log("trayIcon clicked");
    if (mainWindow) {
      console.log("click trayIcon 1");
      if (mainWindow.isFocused()) {
        console.log("click trayIcon 2");
        mainWindow.hide();
      } else if (mainWindow.isVisible()) {
        console.log("click trayIcon 3");
        mainWindow.focus();
      } else {
        console.log("click trayIcon 4");
        mainWindow.show();
      }
      console.log("click trayIcon 6");
    } else {
      console.log("click trayIcon 5");
      mainWindow = createMainWindow();
    }
  });
};

export const destryTray = () => {
  console.log("destryTray");
  if (!appTray || appTray.isDestroyed()) return;
  console.log("destryTray 1")
  appTray.destroy();
  // appTray = null;
};
